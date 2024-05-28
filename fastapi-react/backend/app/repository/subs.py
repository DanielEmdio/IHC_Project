from typing import Optional
from database import db
import models

class SubscriptionsRepository():
    @staticmethod
    def create(user_id: int, personal_trainer_id: int):
        db_sub = models.Subscription(user_id=user_id, personal_trainer_id=personal_trainer_id)
        db.add(db_sub)
        db.commit()
        db.refresh(db_sub)
        return db_sub

    @staticmethod
    def get_pts_for_user(user_id: int) -> Optional[models.PersonalTrainer]: # retrieve all personal_trainers to which the user is subscribed to
        subscriptions = (
            db.query(models.Subscription)
            .filter(models.Subscription.user_id == user_id)
            .all()
        )

        if subscriptions:
            personal_trainers = [sub.personal_trainer for sub in subscriptions]
            return personal_trainers
        else:
            return None

    @staticmethod
    def get_users_for_pt(personal_trainer_id: int) -> Optional[models.User]: # retrieve all users subscribed to a personal trainer
        subscriptions = (
            db.query(models.Subscription)
            .filter(models.Subscription.personal_trainer_id == personal_trainer_id)
            .all()
        )

        if subscriptions:
            users = [sub.user for sub in subscriptions]
            return users
        else:
            return None

    @staticmethod
    def get_pt_ids_for_user(user_id: int):
        result = (
            db.query(models.User)
            .filter(models.User.id == user_id)
            .first()
        )

        PTs_id = []
        if result:
            PTs_id = [sub.personal_trainer_id for sub in result.subscriptions]
        return PTs_id

    @staticmethod
    def get_user_ids_for_pt(pt_id: int):
        result = (
            db.query(models.PersonalTrainer)
            .filter(models.PersonalTrainer.id == pt_id)
            .first()
        )

        users_id = []
        if result:
            users_id = [sub.user_id for sub in result.subscriptions]
        return users_id
