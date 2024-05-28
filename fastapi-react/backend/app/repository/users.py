from repository.workouts import WorkoutsRepository
from repository.pts import PersonalTrainersRepository
from repository.subs import SubscriptionsRepository
from repository.workout_exercises import WorkoutExercisesRepository
from auth.oauth2_jwt import *
from typing import List
from database import db
import models, schemas
import random, string

class UsersRepository():
    @staticmethod
    def create(user: schemas.BasicUser) -> models.User:
        # create user
        db_user = models.User(**user.model_dump())

        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def get_user(user_id: int) -> Optional[models.User]:
        return db.query(models.User).filter(models.User.id == user_id).first()

    @staticmethod
    def get_user_by_token(token: str) -> Optional[models.User]:
        return db.query(models.User).filter(models.User.token == token).first()

    @staticmethod
    def get_user_by_username(username: str) -> Optional[models.User]:
        return db.query(models.User).filter(models.User.username == username).first()

    @staticmethod
    def get_user_by_username_password(username: str, password: str) -> Optional[models.User]:
        return db.query(models.User).filter(models.User.username == username, models.User.password == password).first()

    @staticmethod
    def get_users(skip: int = 0, limit: int = 100) -> list[models.User]: # retrieve all users
        return db.query(models.User).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_athlete_weight_progress(user_id):
        return db.query(models.AthleteWeight).filter(models.AthleteWeight.id == user_id).order_by(models.AthleteWeight.date).all()
    
    @staticmethod
    def add_athlete_weight_progress(user_id, weight, date):
        athlete_weight = models.AthleteWeight(id=user_id, weight=weight, date=date)
        db.add(athlete_weight)
        db.commit()
        db.refresh(athlete_weight)
        return athlete_weight

    """@staticmethod
    def get_user_pts(user_id: int):     # retrieve all personal_trainers to which the user is subscribed to
        user = (
            db.query(models.Subscription)
            .filter(models.Subscription.user_id == user_id)
            .options(joinedload(models.Subscription.personal_trainer))
            .all()
        )
        if user:
            # Access the related PTs objects using user.pts
            personalTrainers = [usr.personal_trainer for usr in user]
            # subs_list = user.subscriptions
            # pt_ids = [subscription.personal_trainer_id for subscription in subs_list]
            # pts = []
            # for id in pt_ids:
            #     pts+=db.query(models.PersonalTrainer).filter(models.PersonalTrainer.id==id)
            # print(pts)
            #return {"relation list": subs_list, "pts":pts}
            return personalTrainers   
        else:
            return {"hi": "User not found"}"""

    # @staticmethod
    # def get_user_pts(user_id: int):     # retrieve all personal_trainers to which the user is subscribed to
    #     subscriptions = (
    #         db.query(models.Subscription)
    #         .filter(models.Subscription.user_id == user_id)
    #         .all()
    #     )
    #     if subscriptions:
    #         personal_trainers = [sub.personal_trainer for sub in subscriptions]
    #         return personal_trainers
    #     else:
    #         return "User not found"
    # @staticmethod
    # def get_subs_id(user_id: int):
    #     result = (
    #         db.query(models.User)
    #         .filter(models.User.id == user_id)
    #         .first()
    #     )
    #     PTs_id=[]
    #     print("func->get_subs_id ______ result: ",result)
    #     if result:
    #         PTs_id = [sub.personal_trainer_id for sub in result.subscriptions]
    #         print("PTs_id: ",PTs_id)
    #     return PTs_id

    @staticmethod
    def getAccessibleWorkouts(user_id: int) -> Optional[List[models.Workout]]:
        free_workouts = WorkoutsRepository.getUnrestrictedWorkouts()
        PTs_id = SubscriptionsRepository.get_pt_ids_for_user(user_id)
        workouts = free_workouts
        if PTs_id != []:
            for id in PTs_id:
                priv_workouts = WorkoutsRepository.getPtPrivWorkouts(id)
                # for workout in priv_workouts:
                #     print("PTprivworkouts: ",workout.title, workout.thumbnail)
                if priv_workouts != None:
                    workouts += priv_workouts
        # print("workouts: ",workouts)
        return workouts
    
    @staticmethod
    def getPTWorkouts(user_id: int) -> Optional[List[models.Workout]]:
        PTs_id = SubscriptionsRepository.get_pt_ids_for_user(user_id)
        if PTs_id != []:
            workouts_list = []
            for id in PTs_id:
                workouts = WorkoutsRepository.getPtPrivWorkouts(id)
                workout_PT_username = PersonalTrainersRepository.getPtUsername(id)
                if workouts != None:
                    for work in workouts:
                        work.pt_username = workout_PT_username
                        workouts_list.append(work)

            return workouts_list

        return []

    @staticmethod
    def hasAccessToExercise(user_id: int, videoname: str) -> bool:   # REVIEW THIS FUNCTION
        workouts = UsersRepository.getAccessibleWorkouts(user_id)
        if workouts:
            for workout in workouts:
                exercises = WorkoutExercisesRepository.getExercisesForWorkout(workout.id)
                # print("exercises:",exercises)
                # video = video[0] # video é por exemplo ('./video/pullUps.mp4',), por isso é que preciso de ir buscar o primeiro elemento
                for ex in exercises:
                    # print("ex:",ex.path, "videoname:",videoname)
                    if videoname in ex.path:
                        return True
        return False
    
    @staticmethod
    def hasAccessToWorkout(user_id: int, workoutTitle: str) -> bool:   # REVIEW THIS FUNCTION
        workouts = UsersRepository.getAccessibleWorkouts(user_id)
        if workouts:
            for workout in workouts:
                # video = video[0] # video é por exemplo ('./video/pullUps.mp4',), por isso é que preciso de ir buscar o primeiro elemento
                print("workout:",workout.title, "workoutTitle:",workoutTitle)
                if workoutTitle==workout.title:
                    return True
        return False

    @staticmethod
    def hasAccessToImage(user_id: int, imagename: str) -> bool:
        return True

    @staticmethod
    def logIn(user: models.User) -> str:
        # check if user already has a token
        if UsersRepository.get_user_by_username_password(user.username, user.password).token != None:
            jwt_token: str = create_jwt_access_token({ "token": user.token, "isNormalUser": True })
            return jwt_token

        # generate the new token for the user
        token = ''.join(random.choice(string.ascii_uppercase + string.digits + string.ascii_lowercase) for _ in range(12))
        while len(db.query(models.User).filter(models.User.token == token).all()) > 0:
            token = ''.join(random.choice(string.ascii_uppercase + string.digits + string.ascii_lowercase) for _ in range(12))

        # assign the new token and update the db
        user.token = token
        db.commit()

        jwt_token: str = create_jwt_access_token({ "token": token, "isNormalUser": True })
        return jwt_token

    @staticmethod
    def getChatId(user_id: int, pt_id: int):
        pass

    @staticmethod
    def logOut():
        pass

    @staticmethod
    def validToken():
        pass
