from typing import List
from database import db
import models, schemas

class WorkoutExercisesRepository():
    @staticmethod
    def create(entry: schemas.WorkoutExercise) -> models.WorkoutExercise:
        # create workout_exercise
        db_workout_exercise = models.WorkoutExercise(**entry.model_dump())
        db.add(db_workout_exercise)
        db.commit()
        db.refresh(db_workout_exercise)
        return db_workout_exercise


    @staticmethod
    def getExercisesForWorkout(workout_id: int) -> List[models.WorkoutExercise]:
        # get the exercises_id for the workout
        # exercises_id = db.query(models.WorkoutExercise).filter(models.WorkoutExercise.workout_id == workout_id).all()
        # exercises = []
        # for exercise in exercises_id:
        #     exercises.append(ExercisesRepository.getExercise(exercise.exercise_id))
        # return exercises

        return db.query(models.Exercise).join(models.WorkoutExercise).filter(models.WorkoutExercise.exercise_id == models.Exercise.id).filter(models.WorkoutExercise.workout_id==workout_id).all()
