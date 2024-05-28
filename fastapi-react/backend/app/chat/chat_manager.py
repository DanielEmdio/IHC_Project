from fastapi import FastAPI, WebSocket
from typing import List

app = FastAPI()

# basic socket manager class
class ChatManager:
    def __init__(self):
        self.active_connections: List[(WebSocket, int)] = []

    async def connect(self, websocket: WebSocket, chat_id: int):
        self.active_connections.append((websocket, chat_id))

    def disconnect(self, websocket: WebSocket, chat_id: int):
        self.active_connections.remove((websocket, chat_id))

    async def send(self, websocket: WebSocket, chat_id: int, data):
        for connection in self.active_connections:
            if connection[0] != websocket and connection[1] == chat_id:
                await connection[0].send_json(data)

chat_manager = ChatManager()
