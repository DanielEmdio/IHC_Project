from repository.workout_exercises import WorkoutExercisesRepository
from repository.workouts import WorkoutsRepository
from repository.subs import SubscriptionsRepository
from auth.oauth2_jwt import *
from database import db
from typing import List
import models, schemas
import random, string

class PersonalTrainersRepository():
    @staticmethod
    def create(pt: schemas.BasicPersonalTrainer) -> models.PersonalTrainer:
        # create pt
        db_pt = models.PersonalTrainer(**pt.model_dump())
        db.add(db_pt)
        db.commit()
        db.refresh(db_pt)
        return db_pt

    @staticmethod
    def get_pt(pt_id: int) -> Optional[models.PersonalTrainer]:
        return db.query(models.PersonalTrainer).filter(models.PersonalTrainer.id == pt_id).first()

    @staticmethod
    def get_pt_by_username(username: str) -> Optional[models.PersonalTrainer]: # retorna o username e o token 
        return db.query(models.PersonalTrainer).filter(models.PersonalTrainer.username == username).first()
    
    #@staticmethod
    #def get_pt_by_email(email: str) -> Optional[models.PersonalTrainer]:
    #    return db.query(models.PersonalTrainer).filter(models.PersonalTrainer.email == email).first()

    @staticmethod
    def get_pt_by_token(token: schemas.TokenData) -> Optional[models.PersonalTrainer]:
        #print("token: ",token)
        #token = token.token
        #print
        #print(db.query(models.PersonalTrainer).filter(models.PersonalTrainer.token == token).first())
        # print("token: ",token)
        # #print all element of the table, and columns id, username, password, token
        # t =db.query(models.PersonalTrainer).all()
        # for i in t:
        #     print(i.id,i.username,i.password,i.token)
        return db.query(models.PersonalTrainer).filter(models.PersonalTrainer.token == token).first()

    @staticmethod
    def get_pt_by_username_password(username: str, password: str) -> Optional[models.PersonalTrainer]:
        return db.query(models.PersonalTrainer).filter(models.PersonalTrainer.username == username and models.PersonalTrainer.password == password).first()

    @staticmethod
    def get_pt_username_token(pt_id: str) -> Optional[models.PersonalTrainer]: # retorna o username e o token 
        return db.query(models.PersonalTrainer.username,models.PersonalTrainer.token).filter(models.PersonalTrainer.id == pt_id).first()

    @staticmethod
    def get_pts(skip: int = 0, limit: int = 100) -> list[models.PersonalTrainer]: # retrieve all users
        return db.query(models.PersonalTrainer).offset(skip).limit(limit).all()

    @staticmethod
    def get_new_pts(user_id) -> list[models.PersonalTrainer]: 
        pt_ids_to_exclude = SubscriptionsRepository.get_pt_ids_for_user(user_id) # get the pts ids to which the user is subbed
        return db.query(models.PersonalTrainer).filter(~models.PersonalTrainer.id.in_(pt_ids_to_exclude)).all()

    # details will be dictionary with the following keys: name, email, description, tags, photo, price, slots, lang, hours, education, bg
    @staticmethod
    def update_pt_details(pt_id: int, details):
        pt = db.query(models.PersonalTrainer).filter(models.PersonalTrainer.id == pt_id).first()
        print(details)
        for key in details:
            setattr(pt, key, details[key])
        # print all pt elements
        # print(pt.id,pt.username,pt.password,pt.token,pt.name,pt.email,pt.description,pt.tags,pt.photo,pt.price,pt.slots,pt.lang,pt.hours,pt.education,pt.bg)
        db.commit()

    # caso o pt já tenha uma foto(photopath), esta será substituída pela nova
    @staticmethod
    def save_pt_photopath(pt_username : str, pt_id: int):
        photopath = "./avatars/"+pt_username+".png"
        pt = db.query(models.PersonalTrainer).filter(models.PersonalTrainer.id == pt_id).first()
        pt.photo = photopath
        db.commit()


    

    @staticmethod
    def get_pt_username(pt_id: str): # retorna o username do PersonalTrainer, com base no seu id
        return db.query(models.PersonalTrainer.username).filter(models.PersonalTrainer.id == pt_id).scalar()

    # @staticmethod
    # def get_pt_priv_videos(pt_id:str):
    #     result = (
    #         db.query(models.PersonalTrainer)
    #         .filter(models.PersonalTrainer.id == pt_id)
    #         .first()
    #     )
    #     if result:
    #         videos = result.workouts
    #         videos = [vid for vid in videos if vid.restricted==1]
    #         return videos
    #     else:
    #         return None
    # @staticmethod
    # def get_pt_videos(pt_id:str):
    #     result = (
    #         db.query(models.PersonalTrainer)
    #         .filter(models.PersonalTrainer.id == pt_id)
    #         .first()
    #     )
    #     if result:
    #         videos = result.workouts
    #         return videos
    #     else:
    #         return None

    @staticmethod
    def getAccessibleWorkouts(pt_id: int) -> Optional[List[models.Workout]]:
        unrestricted_workouts = WorkoutsRepository.getUnrestrictedWorkouts()
        private_workouts =  WorkoutsRepository.getPtPrivWorkouts(pt_id)
        # print("unrestricted_workouts: ",unrestricted_workouts)
        # print("private_workouts: ",private_workouts)
        if private_workouts == None or private_workouts == []:
            return unrestricted_workouts

        # put all videos in a single list
        workouts = unrestricted_workouts+private_workouts
        return workouts

    @staticmethod
    def getPTPrivWorkouts(pt_id: int) -> Optional[List[models.Workout]]:
        private_workouts = WorkoutsRepository.getPtPrivWorkouts(pt_id)
        if private_workouts == None:
            return []
        
        # add the username of the pt to the workouts
        pt_username = PersonalTrainersRepository.getPtUsername(pt_id)
        for workout in private_workouts:
            workout.pt_username = pt_username

        return private_workouts

    @staticmethod
    def getPtUsername(pt_id: str) -> Optional[str]:
        return db.query(models.PersonalTrainer.username).filter(models.PersonalTrainer.id == pt_id).scalar() # scalar() returns the first column of the first row

    @staticmethod
    def hasAccessToExercise(pt_id: int, videoname: str) -> bool:  # REVIEW THIS FUNCTION
        workouts = PersonalTrainersRepository.getAccessibleWorkouts(pt_id)
        if workouts:
            for workout in workouts:
                exercises = WorkoutExercisesRepository.getExercisesForWorkout(workout.id)
                # video = video[0] # video é por exemplo ('./video/pullUps.mp4',), por isso é que preciso de ir buscar o primeiro elemento
                for ex in exercises:
                    if videoname in ex.path:
                        return True
        return False

    @staticmethod
    def hasAccessToWorkout(pt_id: int, workoutTitle: str) -> bool:
        workouts = PersonalTrainersRepository.getAccessibleWorkouts(pt_id)
        if workouts:
            for workout in workouts:
                # video = video[0] # video é por exemplo ('./video/pullUps.mp4',), por isso é que preciso de ir buscar o primeiro elemento
                if workoutTitle==workout.title:
                    return True
        return False
        
        # workouts = PersonalTrainersRepository.getAccessibleWorkouts(pt_id)
        # if workouts:
        #     for workout in workouts:
        #         # video = video[0] # video é por exemplo ('./video/pullUps.mp4',), por isso é que preciso de ir buscar o primeiro elemento
        #         if workoutTitle in workout.videopath:
        #             return True
        # return False

    @staticmethod
    def hasAccessToImage(pt_id: int, imagename: str) -> bool:
        return True
    
    @staticmethod
    def create_exercise(pt_id: int, details):
        # create the exercise
        exercise = models.Exercise(**details)
        exercise.personal_trainer_id = pt_id
        db.add(exercise)
        db.commit()
        db.refresh(exercise)
        return exercise.id
    
    @staticmethod
    def check_exercise_table():
        exercises = db.query(models.Exercise).all()
        for exercise in exercises:
            print("HEREEEEEEEEEEEEEEEEEEEEEEEE-----------",exercise.id,exercise.path,exercise.name,exercise.description,exercise.muscletargets,exercise.dificulty,exercise.personal_trainer_id,exercise.thumbnail_path)
    
    @staticmethod
    def save_exercise_videopath(video_path: str, exercise_id: int):
        exercise = db.query(models.Exercise).filter(models.Exercise.id == exercise_id).first()
        exercise.path = video_path
        db.commit()
        
    @staticmethod
    def save_exercise_thumbnailpath(thumbnail_path: str, exercise_id: int):
        exercise = db.query(models.Exercise).filter(models.Exercise.id == exercise_id).first()
        exercise.thumbnail_path = "thumbnails/"+thumbnail_path
        db.commit()

    @staticmethod 
    def save_common_mistake_videopath(video_path: str, common_mistake_id: int):
        common_mistake = db.query(models.CommonMistake).filter(models.CommonMistake.id == common_mistake_id).first()
        common_mistake.path = "common_mistakes/"+video_path
        db.commit()


    @staticmethod
    def save_common_mistake_description(description):
        # create the common mistake
        common_mistake = models.CommonMistake(**description)
        db.add(common_mistake)
        db.commit()
        db.refresh(common_mistake)
        return common_mistake.id

    @staticmethod
    def check_common_mistake_table():
        common_mistakes = db.query(models.CommonMistake).all()
        for mistake in common_mistakes:
            print("HEREEEEEEEEEEEEEEEEEEEEEEEE-----------",mistake.id,mistake.path,mistake.description,mistake.exercise_id)

    @staticmethod
    def logIn(pt: models.PersonalTrainer) -> str:
        # check if user already has a token
        if PersonalTrainersRepository.get_pt_by_username_password(pt.username, pt.password).token != None:
            jwt_token: str = create_jwt_access_token({ "token": pt.token, "isNormalUser": False })
            return jwt_token

        # generate the new token for the user
        token = ''.join(random.choice(string.ascii_uppercase + string.digits + string.ascii_lowercase) for _ in range(12))
        while len(db.query(models.PersonalTrainer).filter(models.PersonalTrainer.token == token).all()) > 0:
            token = ''.join(random.choice(string.ascii_uppercase + string.digits + string.ascii_lowercase) for _ in range(12))

        # assign the new token and update the db
        pt.token = token
        db.commit()

        jwt_token: str = create_jwt_access_token({ "token": token, "isNormalUser": False })
        return jwt_token

    @staticmethod
    def logOut():
        pass
