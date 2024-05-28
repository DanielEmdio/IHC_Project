from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from repository.pts import PersonalTrainersRepository
from repository.messages import MessagesRepository
from repository.users import UsersRepository
from repository.chat import ChatRepository
from chat.chat_manager import chat_manager
from auth.oauth2_jwt import *
from typing import List
import schemas

router = APIRouter(prefix="/chat")

@router.websocket("")
async def chat_endpoint(websocket: WebSocket):
    try:
        # accept socket connection
        await websocket.accept()

        # parse the first message that needs to be for authentication
        auth_data = await websocket.receive_json()
        if ("token" not in auth_data) or ("id" not in auth_data):
            await websocket.close()
            return { "result": "no", "error": "Unauthorized." }

        # authenticate the user
        jwt_token_data = get_jwt_token_data(token=auth_data["token"])
        if jwt_token_data == None:
            await websocket.close()
            return { "result": "no", "error": "Invalid token." }

        if jwt_token_data["isNormalUser"] == True:
            # get user id
            user_id: int = UsersRepository.get_user_by_token(token=jwt_token_data["token"]).id
            if user_id == None:
                await websocket.close()
                return { "result": "no", "error": "Unauthorized." }

            # get pt id
            pt: int = PersonalTrainersRepository.get_pt(pt_id=auth_data["id"])
            if pt == None:
                await websocket.close()
                return { "result": "no", "error": "Unauthorized." }
            pt_id = int(auth_data["id"])
        else:
            pt_id: int = PersonalTrainersRepository.get_pt_by_token(token=jwt_token_data["token"]).id
            if pt_id == None:
                await websocket.close()
                return { "result": "no", "error": "Unauthorized." }

            # get pt id
            user: int = UsersRepository.get_user(user_id=auth_data["id"])
            if user == None:
                await websocket.close()
                return { "result": "no", "error": "Unauthorized." }
            user_id = int(auth_data["id"])

        # get chat id
        chat_id: Optional[int] = ChatRepository.getChatIdByUserPt(user_id=user_id, pt_id=pt_id)
        if chat_id == None:
            # chat does not exist, create one
            chat_id: int = ChatRepository.create(user_id=user_id, pt_id=pt_id)

        # message handling loop
        await chat_manager.connect(websocket, chat_id)
        while True:
            data = await websocket.receive_json()
            MessagesRepository.create(chat_id=chat_id, sent_by_user=jwt_token_data["isNormalUser"], text=data["message"])
            await chat_manager.send(websocket, chat_id, data)
    except WebSocketDisconnect:
        if "chat_id" in locals():
            chat_manager.disconnect(websocket, chat_id)

@router.post("/getChatMessages")
def get_chat_messages(token: schemas.TokenData, id: int):
    # authenticate the user
    jwt_token_data = get_jwt_token_data(token=token.token)
    if jwt_token_data == None:
        return { "result": "no", "error": "Invalid token." }

    if jwt_token_data["isNormalUser"] == True:
        # get user id
        user_id: int = UsersRepository.get_user_by_token(token=jwt_token_data["token"]).id
        if user_id == None:
            return { "result": "no", "error": "Unauthorized." }

        # get pt id
        pt: int = PersonalTrainersRepository.get_pt(pt_id=id)
        if pt == None:
            return { "result": "no", "error": "Unauthorized." }
        pt_id = int(id)
    else:
        pt_id: int = PersonalTrainersRepository.get_pt_by_token(token=jwt_token_data["token"]).id
        if pt_id == None:
            return { "result": "no", "error": "Unauthorized." }

        # get pt id
        user: int = UsersRepository.get_user(user_id=id)
        if user == None:
            return { "result": "no", "error": "Unauthorized." }
        user_id = int(id)

    # get chat id
    chat_id: Optional[int] = ChatRepository.getChatIdByUserPt(user_id=user_id, pt_id=pt_id)
    if chat_id == None:
        # chat does not exist, create one
        chat_id: int = ChatRepository.create(user_id=user_id, pt_id=pt_id)
        return { "result": "no", "error": "Chat Does not exist." }

    messages: List[dict] = MessagesRepository.getMessagesByChatId(chat_id=chat_id)
    return { "result": "ok", "messages": messages }
