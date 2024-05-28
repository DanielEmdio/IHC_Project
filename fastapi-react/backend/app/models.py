# DESCRIPTION:
# In this file are all the definitions for the tables in our database

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, index=True)
    password = Column(String, index=True)
    token = Column(String, index=True)
    
    subscriptions = relationship("Subscription", back_populates="user") # se fizermos um request pedindo pela coluna "subscriptions", isso retornará todos os pts a que o "user" se subscreveu

class AthleteWeight(Base):
    __tablename__ = "athlete_weight"
    id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    date = Column(Date, primary_key=True)
    weight = Column(Integer, index=True)

class PersonalTrainer(Base):
    __tablename__ = "personal_trainers"

    id = Column(Integer, primary_key=True)
    token = Column(String, index=True)
    username = Column(String, index=True)
    password = Column(String, index=True)
    email = Column(String, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)
    tags = Column(String, index=True)
    photo = Column(String, index=True)
    price = Column(String, index=True)
    slots = Column(Integer, index=True)
    lang = Column(String, index=True)
    hours = Column(String, index=True)
    rating = Column(String, index=True)
    n_comments = Column(String, index=True)
    education = Column(String, index=True)
    bg = Column(String, index=True)
    subscriptions = relationship("Subscription", back_populates="personal_trainer")
    #exercises = relationship("Exercise", back_populates="personal_trainer")

class Exercise(Base):
    __tablename__ = "exercise"

    id = Column(Integer, primary_key=True)
    path = Column(String, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)
    muscletargets = Column(String, index=True)
    dificulty = Column(String, index=True)
    personal_trainer_id = Column(Integer, ForeignKey("personal_trainers.id"), index=True)
    thumbnail_path = Column(String, index=True)
    # Pt = Column(Integer, ForeignKey("pts.id"), index=True) # refers to a user id

class CommonMistake(Base):
    __tablename__ = "common_mistake"

    id = Column(Integer, primary_key=True)
    path = Column(String, index=True)
    description = Column(String, index=True)
    exercise_id = Column(Integer, ForeignKey("exercise.id"), index=True)

class WorkoutExercise(Base):
    __tablename__ = "workout_exercise"

    workout_id = Column(Integer, ForeignKey("workout.id"), primary_key=True)
    exercise_id = Column(Integer, ForeignKey("exercise.id"), primary_key=True)
    set_num = Column(Integer, primary_key=True)
    reps_or_time = Column(Integer, index=True)
    is_time = Column(Integer, index=True)

class Workout(Base):
    __tablename__ = "workout"

    id = Column(Integer, primary_key=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    tags = Column(String, index=True)
    premium = Column(Integer, index=True)
    thumbnail = Column(String, index=True)
    releasedate = Column(Date, index=True)
    duration = Column(String, index=True)
    rating = Column(String, index=True)
    personal_trainer_id = Column(Integer, ForeignKey("personal_trainers.id"), index=True)

class ExerciseProgress(Base):
    __tablename__ = "exercise_progress"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    date = Column(String, index=True)

class RepsProgress(Base):
    __tablename__ = "reps_progress"

    id = Column(Integer, ForeignKey("exercise_progress.id"), primary_key=True)
    exercise_id = Column(Integer, ForeignKey("exercise.id"), index=True)
    set_num = Column(Integer, index=True)
    reps_made = Column(Integer, index=True)
    weight_used = Column(Integer, index=True)

class Subscription(Base):
    __tablename__ = "subscriptions"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    personal_trainer_id = Column(Integer, ForeignKey("personal_trainers.id"), primary_key=True)
    # Both user_id and personal_trainer_id are defined as primary keys because, together, they form a composite primary key for the subscriptions table. 
    # This means that each combination of user_id and personal_trainer_id must be unique in the table

    user = relationship("User", back_populates="subscriptions")
    personal_trainer = relationship("PersonalTrainer", back_populates="subscriptions")

class Chats(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    personal_trainer_id = Column(Integer, ForeignKey("personal_trainers.id"), index=True)

class Messages(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey("chats.id"), index=True)
    sent_by_user = Column(Boolean, index=True)
    text = Column(String, index=True)

# class Users(Base):
#     __tablename__ = 'users'
#     id = Column(Integer, primary_key=True)
#     username = Column(String, index=True)
#     password = Column(String, index=True)
#     token = Column(String, index=True)
#     #role = Column(String, index=True) # free, premium, pt, admin
#     PTid = Column(Integer, ForeignKey("pts.id")) # refers to a pt id
#     #videos = Column(String, index=True)
# class PTs(Base):
#     __tablename__ = 'pts'
#     id = Column(Integer, primary_key=True)
#     token = Column(String, index=True)
#     PT = Column(String, index=True)
#     password = Column(String, index=True)
# class Pt_video_connection(Base):
#     __tablename__ = "pt_video_connection"
#     pt_id = Column(Integer, ForeignKey("pts.id"),primary_key=True)
#     video_id = Column(Integer, ForeignKey("videos.id"),primary_key=True)
#     video = relationship("Videos",back_populates="owner")
#     pt = relationship("Pts",back_populates="workouts")
# class Users(Base):
#     __tablename__ = 'users'
#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String, index=True)
#     password = Column(String, index=True)
#     token = Column(String, index=True)
#     role = Column(String, index=True) # free, premium, admin
#     pt_ids = Column(String, index=True)
# class Pts(Base):
#     __tablename__ = 'pts'
#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String, index=True)
#     password = Column(String, index=True)
#     token = Column(String, index=True)
#     videos = Column(String, index=True)
