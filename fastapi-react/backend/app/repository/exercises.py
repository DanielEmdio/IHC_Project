from typing import List
from database import db
import models, schemas
from sqlalchemy import or_

class ExercisesRepository():
    @staticmethod
    def create(exercise: schemas.ExerciseCreate) -> schemas.ExerciseCreate: # ESTA FUNÇÃO NÃO ASSOCIA O VIDEO AO PT 
        db_exercise = exercise
        db.add(db_exercise)
        db.commit()
        db.refresh(db_exercise)
        return db_exercise
    
    @staticmethod
    def getExercise(exercise_id) -> List[models.Exercise]:    # getExercise -> getVideo
        return db.query(models.Exercise).filter(models.Exercise.id == exercise_id).first()

    @staticmethod
    def getAllExercises(skip: int = 0, limit: int = 100) -> List[models.Exercise]:
        return db.query(models.Exercise).offset(skip).limit(limit).all()
    
    @staticmethod
    def getPTExercises(pt_id: int) -> List[models.Exercise]:        # returns all exercises that belong to a PT or are not associated with any PT
        return db.query(models.Exercise).filter(
            or_(models.Exercise.personal_trainer_id == pt_id,models.Exercise.personal_trainer_id==None)).all()
