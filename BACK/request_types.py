from pydantic import BaseModel

class UserRequest(BaseModel):
    user_id: str

class MessageRequest(UserRequest):
    input: str
