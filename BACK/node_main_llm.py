import json
from typing import List, Optional
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from .states import State, ToolDecision, ToolDecisions

class DebugLLM(ChatGoogleGenerativeAI):
    def _generate(self, messages, stop = None, run_manager = None, *, tools = None, functions = None, safety_settings = None, tool_config = None, generation_config = None, cached_content = None, tool_choice = None, **kwargs):
        return super()._generate(messages, stop, run_manager, tools=tools, functions=functions, safety_settings=safety_settings, tool_config=tool_config, generation_config=generation_config, cached_content=cached_content, tool_choice=tool_choice, **kwargs)

class MainLLM:
    NODE_NAME = "orchestrator"
    
    def __init__(self, all_tool_map, auto_pad):
        self.instructions = (
            "You are an English- and Dutch-speaking agent. Your role is to analyze a user's request and identify all necessary tools to fulfill it. "
            "You must return a list of tool decisions, where each decision specifies a tool from the following options: 'code_generator', 'image_generator', 'video_generator', '3d_model_generator', "
            "or 'music_generator', and a corresponding query. If no tools are suitable, return an empty list. "
            "The 'query' field should contain the specific part of the user's request that is relevant to that tool. "
            "You can choose from these exact tool names: 'code_generator', 'image_generator', 'video_generator', '3d_model_generator', 'music_generator'. "
            "Never use 'null' or any other tool name. If the user refers to something from previous conversation (like 'make it blue'), "
            "determine what they're referring to from the conversation context and create appropriate tasks."
        )
        self.all_tool_map = all_tool_map
        self.auto_pad = auto_pad

    def main(self, state: State):
        llm = DebugLLM(
            model="gemini-2.5-flash",
            model_kwargs={"system_instruction": self.instructions}
        )
        
        planner_llm = llm.with_structured_output(ToolDecisions)
        
        per_message_instruction = "⚠️ Do not return any tools if the human message is simply a greeting or a show of appreciation."
        
        message_history = [{"role": "system", "content": per_message_instruction}] + state["messages"]
        
        try:
            response = planner_llm.invoke(message_history)
            if response and response.decisions:
                # Filter out any invalid tool names
                valid_tools = {'code_generator', 'image_generator', 'video_generator', '3d_model_generator', 'music_generator'}
                sub_tasks = []
                for d in response.decisions:
                    if d.tool_name in valid_tools:
                        sub_tasks.append({"tool_name": d.tool_name, "query": d.query})
                    else:
                        # Log invalid tool name but don't crash
                        print(f"Warning: Invalid tool name '{d.tool_name}' ignored")
            else:
                sub_tasks = []
                
            return {"sub_tasks": sub_tasks}
        
        except Exception as e:
            print(f"Error in orchestrator: {e}")
            return {"sub_tasks": [], "final_response": "An error occurred while processing your request."}