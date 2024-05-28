from database import db
from typing import List
import models

class MessagesRepository():
    @staticmethod
    def create(chat_id: int, sent_by_user: bool, text: str):
        message = models.Messages(chat_id=chat_id, sent_by_user=sent_by_user, text=text)
        db.add(message)
        db.commit()
        db.refresh(message)

    @staticmethod
    def getMessagesByChatId(chat_id: int) -> List[dict]:
        messages: List[models.Messages] = db.query(models.Messages).filter(models.Messages.chat_id == chat_id).all()
        return [{ "sent_by_user": message.sent_by_user, "text": message.text } for message in messages]
