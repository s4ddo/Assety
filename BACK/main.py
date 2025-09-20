import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from assety_main import Assety
from request_types import UserRequest, MessageRequest

import uvicorn
import requests


origins = [
    "*",
    "http://localhost:5173", 
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   
    allow_credentials=True,
    allow_methods=["*"],   
    allow_headers=["*"],   
)

chatbot = Assety()

@app.get("/")
def hello_world():
    """Example Hello World route."""
    name = os.environ.get("NAME", "World")
    return f"Hello {name}!"

@app.get("/checkaddress")
def checkaddress():
    ip = requests.get("https://api.ipify.org").text
    return f"My public IP is: {ip}"

@app.post("/request")
def handle_message(request: MessageRequest):
    message = request.input
    user_id = request.user_id

    if message.lower() in ["quit", "exit", "q"]:
        print("Goodbye!")

    reply = chatbot.stream_graph_updates(message, user_id)
    
    return {"reply": reply}

@app.post("/exit")
def handle_exit(request: UserRequest):
    user_id = request.user_id

    if not user_id:
        return {"status": "error", "message": "user_id is required"}
    
    try:
        chatbot.checkpointer.delete_thread(user_id)
        return {"status": "success", "message": f"Thread for user {user_id} deleted successfully."}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)