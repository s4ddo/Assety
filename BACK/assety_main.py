import os
import json
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send
from langchain_core.messages import HumanMessage, AIMessage
from pprint import pprint
from dotenv import load_dotenv
from node_main_llm import MainLLM
from states import State, WorkerState, ToolDecisions
from langchain_google_genai import ChatGoogleGenerativeAI

class Assety:
    def __init__(self):
        # Get the directory of the current file (assety_main.py)
        base_dir = os.path.dirname(os.path.abspath(__file__))
        dotenv_path = os.path.join(base_dir, '.env')
        
        # Load the .env file from the explicit path
        load_dotenv(dotenv_path) 
        
        self.main_llm = MainLLM(None, self)
        self.checkpointer = InMemorySaver()
        self.graph = self.build_graph()
        self.synthesize_llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash"
        )
        self.codegen_llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash"
        )


    def build_graph(self):
        graph_builder = StateGraph(State)

        # Nodes
        graph_builder.add_node("orchestrator", self.main_llm.main)
        graph_builder.add_node("code_generator", self.code_generator_worker)
        graph_builder.add_node("image_generator", self.image_generator_worker)
        graph_builder.add_node("3d_model_generator", self.three_d_model_generator_worker)
        graph_builder.add_node("music_generator", self.music_generator_worker)
        graph_builder.add_node("synthesizer", self.synthesizer)

        # Edges
        graph_builder.add_edge(START, "orchestrator")
        
        graph_builder.add_conditional_edges("orchestrator", self.assign_workers)
        
        graph_builder.add_edge("code_generator", "synthesizer")
        graph_builder.add_edge("image_generator", "synthesizer")
        graph_builder.add_edge("3d_model_generator", "synthesizer")
        graph_builder.add_edge("music_generator", "synthesizer")
        
        graph_builder.add_edge("synthesizer", END)

        return graph_builder.compile(checkpointer=self.checkpointer)

    def assign_workers(self, state: State):
        """Assigns tasks to the correct workers based on the orchestrator's decisions.
        This function now returns a list of Send objects for parallel execution."""
        tasks = state.get("sub_tasks", [])
        if not tasks:
            return "synthesizer"
        
        valid_tools = {'code_generator', 'image_generator', '3d_model_generator', 'music_generator'}
        sends = []
        
        for task in tasks:
            tool_name = task["tool_name"]
            if tool_name in valid_tools:
                sends.append(Send(tool_name, {"task": task}))
            else:
                print(f"Skipping invalid tool name: {tool_name}")
        
        if not sends:
            return "synthesizer"
            
        return sends
    

    def code_generator_worker(self, state: WorkerState):
        """Code Generator Worker"""

        per_message_instruction = " You are an expert code generator. You only generate code and nothing else. Always keep your code as short and efficient as possible."

        task = state["task"]
        prompt = [{"role": "system", "content": per_message_instruction}] + [task['query']]
        response = self.synthesize_llm.invoke(prompt)
        content = response.content
        return {"worker_outputs": [content]}

    def image_generator_worker(self, state: WorkerState):
        """Dummy Image Generator Worker"""
        task = state["task"]
        return {"worker_outputs": [f"Dummy image URL for: {task['query']}"]}

    def three_d_model_generator_worker(self, state: WorkerState):
        """Dummy 3D Model Generator Worker"""
        task = state["task"]
        return {"worker_outputs": [f"meshfile='sample_mesh.glb'"]}
    
    def music_generator_worker(self, state: WorkerState):
        """Dummy Music Generator Worker"""
        task = state["task"]
        return {"worker_outputs": [f"audiofile='sample_song.mp3"]}
    

    def synthesizer(self, state: State):
        """
        Synthesizes the final response, adds it to message history,
        and clears the worker outputs for the next run.
        """

        num_subtasks = len(state.get("sub_tasks", []))

        if num_subtasks > 0:

            outputs = state.get("worker_outputs", [])

            current_outputs = outputs[-num_subtasks:]
        else:
            current_outputs = []

        if not current_outputs:
            final_response_text = ""
        else:
            final_response_text = "\n".join(current_outputs)

        
        per_message_instruction = f""" You are a grumpy sleepy cat personality that helps with the user in the generation of video game assets such as 3d meshes, images, and music. 
        based on these results (if there are): **{final_response_text}**
        
        Please format them to these depending on the type. And present them as if you are a cute sleepy cat.
        
        Examples for each data type are:
        
        Mesh: 
        'Here is a mesh for you <mesh src="sample_mesh.glb">'
        
        Audio:
        'Here is a song for you <audio src="sample_song.mp3">'
        
        etc.
        
        Make sure to styalize it with your own personality tho. 
        
        Try to keep it short but nice to save tokens. 
        
        Format and styalize your answers with markdown.
        
        """

        messages = [{"role": "system", "content": per_message_instruction}] + state["messages"]
        response = self.synthesize_llm.invoke(messages)
        

        return {
            "final_response": final_response_text,
            "messages": [response],
            "worker_outputs": [] 
        }

    def stream_graph_updates(self, user_input: str, user_id: str):
        config = {"configurable": {"thread_id": user_id}}
        final_response = None
        pprint(f"USER: {user_input}")

        for update in self.graph.stream(
            {"messages": [{"role": "user", "content": user_input}], "user_id": user_id},
            config,
            stream_mode="updates"
        ):
            
            for node_name, node_output in update.items():
                print(f"--- Output from node: {node_name} ---")
                pprint(node_output)
                print("\n", flush=True)

                if node_name == "synthesizer" and "final_response" in node_output:
                    final_response = node_output["messages"][-1]
        
        print("--- Final Assembled Response ---")
        print(final_response.content)
        return final_response.content