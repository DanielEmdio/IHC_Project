from typing import List, Optional
from database import db
import models, schemas

class WorkoutsRepository():
    @staticmethod
    def create(entry: schemas.WorkoutCreate) -> models.Workout:
        db_workout = models.Workout(**entry.model_dump())
        db.add(db_workout)
        db.commit()
        db.refresh(db_workout)
        return db_workout

    @staticmethod
    def getWorkout(workout_id: int) -> Optional[models.Workout]:
        return db.query(models.Workout).filter(models.Workout.id == workout_id).first()

    @staticmethod
    def getUnrestrictedWorkouts() -> List[models.Workout]:
        return db.query(models.Workout).filter(models.Workout.premium == 0).all()
    
    @staticmethod
    def getPtPrivWorkouts(pt_id: str) -> Optional[List[models.Workout]]:
        return db.query(models.Workout).filter(models.Workout.personal_trainer_id == pt_id, models.Workout.premium == 1).all()
        
        # exercises_id = db.query(models.Exercise).filter(models.Exercise.personal_trainer_id == pt_id).all()

        # if exercises_id:
        #     workouts_id = [exercise.workout_id for exercise in exercises_id]   
        #     workouts = result.workouts
        #     workouts = [vid for vid in workouts if vid.restricted == 1]
        #     return workouts
        # else:
        #     return None

    @staticmethod
    def getPtWorkouts(pt_id:str) -> Optional[List[models.Exercise]]:   # getPtExercises -> getPtVideos
        return db.query(models.Workout).filter(models.Workout.personal_trainer_id==pt_id).all()
        # personal_trainer = db.query(models.PersonalTrainer).filter(models.PersonalTrainer.id == pt_id).first()
        # return personal_trainer.workouts if personal_trainer else None

    @staticmethod
    def save_workout_thumbnailpath(thumbnail_path: str, workout_id: int):
        workout = db.query(models.Workout).filter(models.Workout.id == workout_id).first()
        workout.thumbnail = "thumbnails/"+thumbnail_path
        print("Workout details after commit:", workout.__dict__)
        db.commit()

    @staticmethod
    # print workout table
    def check_workout_table():
        #print("Workout table:", db.query(models.Workout).all())
        for workout in db.query(models.Workout).all():
            print(workout.id, workout.title, workout.description, workout.tags, workout.premium, workout.thumbnail, workout.releasedate, workout.duration, workout.rating, workout.personal_trainer_id)
    
    @staticmethod
    def getAllRestrictedWorkouts():
        pass

    @staticmethod
    def getAllWorkoutsFromPt(ptId):
        pass
