# DESCRIPTION:
# In this file are all the definitions for the Pydantic models

from pydantic import BaseModel
from datetime import date

########################  USER RELATED  ########################
class UserBase(BaseModel):
    username: str

class BasicUser(UserBase):
    password: str

class User(UserBase):
    id: int
    token: str
    subscriptions: list['Subscription'] = [] # the quotes are needed because the class "Subscription" is defined later (at the end of the file)

    class Config:
        from_attributes = True # orm_mode = True

class UserRegister(BasicUser):
    isNormalUser: bool


########################  ATHLETE WEIGHT RELATED  ########################
class AthleteWeightBase(BaseModel):
    date: date
    weight: int

class AthleteWeightCreate(AthleteWeightBase):
    pass

class AthleteWeight(AthleteWeightBase):
    id: int

    class Config:
        from_attributes = True # orm_mode = True




########################  PERSONAL TRAINER RELATED  ########################
class PersonalTrainerBase(BaseModel):
    username:str

class BasicPersonalTrainer(PersonalTrainerBase):
    password: str

class PersonalTrainer(PersonalTrainerBase):
    id: int
    token: str
    name: str
    email: str
    description: str
    tags: str
    photo: str
    price: str
    slots: int
    lang: str
    hours: str
    rating: str
    n_comments: str
    education: str
    bg: str
    subscriptions: list['Subscription'] = []
    workout: list['Exercise'] = []

    class Config:
        from_attributes = True #orm_mode = True

########################  SUBSCRIPTION RELATED  ########################
class SubscriptionBase(BaseModel):
    pass

class SubscriptionCreate(SubscriptionBase):
    pass

class Subscription(SubscriptionBase):
    user: User
    personal_trainer: PersonalTrainer

    class Config:
        from_attributes = True # orm_mode = True


########################  EXERCISE RELATED  ########################
class ExerciseBase(BaseModel):
    pass

class ExerciseCreate(ExerciseBase):
    path: str
    name: str
    description: str
    muscletargets: str
    dificulty: str
    thumbnail_path: str
    exercise_id: int
    personal_trainer_id: int

class Exercise(ExerciseBase):
    id: int

    class Config:
        from_attributes = True #orm_mode = True

class CommonMistakesBase(BaseModel):
    pass

class CommonMistakesCreate(CommonMistakesBase):
    pass

class CommonMistake(CommonMistakesBase):
    id: int
    path: str
    description: str

    class Config:
        from_attributes = True

########################  WORKOUT RELATED  ########################

class WorkoutExerciseBase(BaseModel):
    pass

class WorkoutExerciseCreate(WorkoutExerciseBase):
    reps_or_time: int
    is_time: int
    exercise_id: int
    set_num: int

class WorkoutExercise(WorkoutExerciseCreate):
    workout_id: int
    
    

    class Config:
        from_attributes = True



class WorkoutBase(BaseModel):
    title: str
    description: str
    tags: str
    duration: str
    premium: int
    releasedate: date


class WorkoutCreate(WorkoutBase):
    personal_trainer_id: int
    


class Workout(WorkoutCreate):
    id: int
    thumbnail: str
    rating: str

    class Config:
        from_attributes = True

########################  PROGRESS RELATED  ########################

class ExerciseProgressBase(BaseModel):
    pass

class ExerciseProgressCreate(ExerciseProgressBase):
    pass

class ExerciseProgress(ExerciseProgressBase):
    id: int
    user_id: int
    date: str

    class Config:
        from_attributes = True

class RepsProgressBase(BaseModel):
    pass

class RepsProgressCreate(RepsProgressBase):
    pass

class RepsProgress(RepsProgressBase):
    id: int
    exercise_id: int
    set_num: int
    reps_made: int
    weight_used: int

    class Config:
        from_attributes = True

########################  RANDOM  ########################

class TokenData(BaseModel):
    token: str

class PtDetails(BaseModel):
    name: str 
    email: str 
    description: str 
    tags: str 
    price: str 
    slots: int 
    lang: str 
    hours: str 
    education: str 
    bg: str

class NewExerciseDetails(BaseModel):
    name: str
    description: str
    dificulty: str
    muscletargets: str

class NewCommonMistake(BaseModel):
    description: str
    exercise_id: int