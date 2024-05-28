from typing import Optional, List
from database import db
import models

class ChatRepository():
    @staticmethod
    def create(user_id: int, pt_id: int) -> int:
        chat = models.Chats(user_id=user_id, personal_trainer_id=pt_id)
        db.add(chat)
        db.commit()
        db.refresh(chat)
        return chat.id

    @staticmethod
    def getChatIdByUserPt(user_id: int, pt_id: int) -> Optional[int]:
        chats: List[models.Chats] = db.query(models.Chats).filter(models.Chats.user_id == user_id).all()
        for chat in chats:
            if chat.personal_trainer_id == pt_id:
                return chat.id

        # chat does not exist
        return None
