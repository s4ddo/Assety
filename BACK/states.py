from typing import Annotated, Optional, List
from typing_extensions import TypedDict
from langgraph.graph.message import add_messages
from pydantic import BaseModel, Field
import operator

class State(TypedDict):
    messages: Annotated[list, add_messages]
    user_id: str
    use_tools: str
    selected_tools: Optional[List[str]]
    sub_tasks: List[dict]
    worker_outputs: Annotated[list, operator.add]
    final_response: str

class WorkerState(TypedDict):
    task: dict
    completed_task: Annotated[list, operator.add]

class ToolDecision(BaseModel):
    tool_name: str = Field(
        default="",
        description="The name of the tool to be used, which must be 'code_generator', 'image_generator', 'video_generator', '3d_model_generator', or 'music_generator'."
    )
    query: str = Field(
        default="",
        description="The query string to be passed to the selected tool."
    )

class ToolDecisions(BaseModel):
    decisions: List[ToolDecision] = Field(
        description="A list of tool decisions, where each decision specifies a tool to use and its corresponding query."
    )