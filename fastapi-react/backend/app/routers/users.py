from repository.pts import PersonalTrainersRepository
from repository.subs import SubscriptionsRepository
from repository.users import UsersRepository
from fastapi import APIRouter, UploadFile, File
from auth.oauth2_jwt import *
from typing import Tuple
import schemas

router = APIRouter(prefix="/users")

def check_password_requirements(password: str) -> Tuple[bool, str]:
    special_chars =  ["$", "&", "!"]
    if len(password) < 12 or len(password) > 128:
        return(False, "The password length needs to be in between 12 and 128 characters.")
    elif not any(char.isdigit() for char in password) :
        return(False, "The password needs at least one digit.")
    elif not any(char.isupper() for char in password):
        return(False, "The password needs at least one uppercase letter.")
    elif not any(char.islower() for char in password):
        return(False, "The password needs at least one lowercase letter.")
    elif not any(char in special_chars for char in password):
        return(False, 'The passwords needs at least one of these characters: "$", "&", "!"')
    else: 
        return (True, "")

@router.post("/register")
def register_user(user: schemas.UserRegister):
    # check for user with same name
    if UsersRepository.get_user_by_username(username=user.username):
        return {"result": "no", "error": "Username already in use."}

    # check for pt with same name
    if PersonalTrainersRepository.get_pt_by_username(username=user.username):
        return {"result": "no", "error": "Username already in use."}

    # check password strength
    passwd_req = check_password_requirements(user.password)
    if passwd_req[0] == False:
        return {"result": "no", "error": passwd_req[1]}

    if user.isNormalUser:
        # register the user in the database
        new_user = UsersRepository.create(user=schemas.BasicUser(**user.model_dump()))
        
        # login the new user
        jwt_token: str = UsersRepository.logIn(new_user)
    else:
        new_pt = PersonalTrainersRepository.create(pt=schemas.BasicUser(**user.model_dump()))

        # login the new user
        jwt_token: str = PersonalTrainersRepository.logIn(new_pt)

    return { "result": "ok", "token": jwt_token }

@router.post("/registerPTdetails")
def register_pt_details(token: schemas.TokenData, details: schemas.PtDetails):
    jwt_data: Optional[str] = get_jwt_token_data(token=token.token)
    if jwt_data is None:
        return { "result": "no", "error": "Unauthorized." }

    if jwt_data["isNormalUser"]:
        return { "result": "no", "error": "Unauthorized." }

    pt_id = PersonalTrainersRepository.get_pt_by_token(token=jwt_data["token"]).id
    if pt_id is None:
        return { "result": "no", "error": "Unauthorized." }

    PersonalTrainersRepository.update_pt_details(pt_id, details.model_dump())
    return { "result": "ok", "pt_id": pt_id }

# Before calling this function, we need to change the photofile.name to the pt_id'.png' like this:
#   const pt_id = data1.pt_id; // Supondo que a resposta inclua o pt_id
#   const renamedFile = new File([photofile], `${pt_id}.png`, { type: photofile.type });
# This happens because (if i understood correctly) we can't send the pt_id as a parameter in the request, so we need to change the name of the file to the pt_id
@router.post("/safePTphoto")
async def safe_pt_photo(photofile: UploadFile = File(...)):
    # Extrair pt_id do nome do arquivo
    pt_id = int(photofile.filename.replace('.png', ''))
    pt_username = PersonalTrainersRepository.get_pt_username(pt_id)

    # check the file size
    max_size_in_bytes = 5 * 1024 * 1024  # 5 MB
    content_length = 0
    while True:
        data = photofile.file.read(8192)
        if not data:
            break
        content_length += len(data)
        if content_length > max_size_in_bytes:
            return {"result": "no", "error": "O ficheiro selecionado excede o tamanho máximo (5 MB). Por favor escolha outra imagem."}

    # save the image file
    #print(pt_username)
    with open('./images/avatars/' + pt_username + '.png', 'wb') as f:
        # reset file pointer to the beginning of the file
        photofile.file.seek(0)
        while True:
            data = photofile.file.read(8192)
            if not data:
                break
            f.write(data)

    PersonalTrainersRepository.save_pt_photopath(pt_username,pt_id)
    return { "result": "ok" }

@router.post("/login")
def login_user(user: schemas.BasicUser):
    # get the user instance with the provided username and password
    user_login = UsersRepository.get_user_by_username_password(**user.model_dump())
    if user_login:
        # login as a normal user
        jwt_token: str = UsersRepository.logIn(user_login)
        # jwt_token: str = UsersRepository.getJwtToken(user_login)
        return {"result": "ok", "token": jwt_token}

    pt_login = PersonalTrainersRepository.get_pt_by_username_password(**user.model_dump())
    if pt_login:
        # login as a pt
        jwt_token = PersonalTrainersRepository.logIn(pt_login)
        return {"result": "ok", "token": jwt_token}

    return {"result": "no", "error": "Wrong username or password."}

@router.post("/checkAuthentication")
def check_authentication(token: schemas.TokenData):
    jwt_token_data = get_jwt_token_data(token=token.token)
    if jwt_token_data == None:
        return { "result": "no", "error": "Invalid token." }

    if jwt_token_data["isNormalUser"]:
        if UsersRepository.get_user_by_token(token=jwt_token_data["token"]) == None:
            return { "result": "no", "error": "Invalid token." }
    elif PersonalTrainersRepository.get_pt_by_token(token=jwt_token_data["token"]) == None:
            return { "result": "no", "error": "Invalid token." }

    return { "result": "ok" }

@router.post("/getAthleteWeightData")
def get_weight_progress(token: schemas.TokenData):
    jwt_token_data = get_jwt_token_data(token=token.token)
    if jwt_token_data == None:
        return { "result": "no", "error": "Invalid token." }

    if jwt_token_data["isNormalUser"]:
        user = UsersRepository.get_user_by_token(token=jwt_token_data["token"])
        if user == None:
            return { "result": "no", "error": "Invalid token." }

        data = UsersRepository.get_athlete_weight_progress(user.id)
        data = [{"date":d.date, "weight":d.weight} for d in data]
        return { "result": "ok", "data": data }
    else:
        return { "result": "no", "error": "Unauthorized." }

@router.post("/addAthleteWeightData/{weight}/{date}")
def add_weight_progress(token: schemas.TokenData, weight: int, date: str):
    jwt_token_data = get_jwt_token_data(token=token.token)
    if jwt_token_data == None:
        return { "result": "no", "error": "Invalid token." }

    if jwt_token_data["isNormalUser"]:
        user = UsersRepository.get_user_by_token(token=jwt_token_data["token"])
        if user == None:
            return { "result": "no", "error": "Invalid token." }

        UsersRepository.add_athlete_weight_progress(user.id, weight, date)
        return { "result": "ok" }
    else:
        return { "result": "no", "error": "Unauthorized." }

@router.post("/getPtById/{pt_id}")
def get_Pt_data_by_id(token: schemas.TokenData, pt_id: int):
    jwt_token_data = get_jwt_token_data(token=token.token)
    if jwt_token_data == None:
        return { "result": "no", "error": "Invalid token." }

    if jwt_token_data["isNormalUser"]:
        if UsersRepository.get_user_by_token(token=jwt_token_data["token"]) == None:
            return { "result": "no", "error": "Invalid token." }
    else:
        if PersonalTrainersRepository.get_pt_by_token(token=jwt_token_data["token"]) == None:
            return { "result": "no", "error": "Invalid token." }

    pt = PersonalTrainersRepository.get_pt(pt_id)
    if pt:
        pt = {"name":pt.name, "description":pt.description, "tags":pt.tags, "photo":pt.photo, "price":pt.price, "slots":pt.slots, "lang" : pt.lang, "hours" : pt.hours, "rating" : pt.rating, "n_comments" : pt.n_comments, "education" : pt.education, "bg" : pt.bg} 
        return {"result": "ok", "pt": pt}
    else:
        return {"result": "no", "error": "Personal Trainer not found."} 

@router.post("/getUserById/{user_id}")
def get_User_by_id(token: schemas.TokenData, user_id: int):
    jwt_token_data = get_jwt_token_data(token=token.token)
    if jwt_token_data == None:
        return { "result": "no", "error": "Invalid token." }

    if jwt_token_data["isNormalUser"]:
        if UsersRepository.get_user_by_token(token=jwt_token_data["token"]) == None:
            return { "result": "no", "error": "Invalid token." }
    else:
        if PersonalTrainersRepository.get_pt_by_token(token=jwt_token_data["token"]) == None:
            return { "result": "no", "error": "Invalid token." }

    user = UsersRepository.get_user(user_id)
    if user:
        user = {"name": user.username, "id": user.id}
        return {"result": "ok", "user": user}
    else:
        return {"result": "no", "error": "User not found."} 

@router.post("/getPT")
async def get_PT_by_token(token: schemas.TokenData):
    jwt_token_data = get_jwt_token_data(token=token.token)
    if jwt_token_data == None:
        return { "result": "no", "error": "Invalid token." }
    
    if jwt_token_data["isNormalUser"]:
        return { "result": "no", "error": "Unauthorized." }
    else:
        pt = PersonalTrainersRepository.get_pt_by_token(token=jwt_token_data["token"])
        if pt == None:
            return { "result": "no", "error": "Invalid token." }
        else:
            pt = {"id":pt.id, "name":pt.name, "description":pt.description, "tags":pt.tags, "photo":pt.photo, "price":pt.price, "slots":pt.slots, "lang" : pt.lang, "hours" : pt.hours, "rating" : pt.rating, "n_comments" : pt.n_comments, "education" : pt.education, "bg" : pt.bg}
            return {"result": "yes", "pt": pt}

@router.post("/getSubs")
def get_subs(token: schemas.TokenData):
    jwt_data: Optional[str] = get_jwt_token_data(token=token.token)
    if jwt_data == None:
        return { "result": "no", "error": "Unauthorized." }

    if jwt_data["isNormalUser"] == True:
        user_id: int = UsersRepository.get_user_by_token(token=jwt_data["token"]).id
        if user_id == None:
            return { "result": "no", "error": "Unauthorized." }

        PTs_info = SubscriptionsRepository.get_pts_for_user(user_id)
        if PTs_info != None:
            PTs_info = [{"id":pt.id,"name":pt.name, "description":pt.description, "tags":pt.tags, "photo":pt.photo, "price":pt.price, "slots":pt.slots} for pt in PTs_info]
        else:
            PTs_info = []
        return { "result": "ok", "pts": PTs_info}
    else:
        return { "result": "no", "error": "Unauthorized." }

@router.post("/getUsersSubToPt")
def get_users_sub_to_pt(token: schemas.TokenData):
    jwt_data: Optional[str] = get_jwt_token_data(token=token.token)
    if jwt_data == None:
        return { "result": "no", "error": "Unauthorized." }

    if jwt_data["isNormalUser"] == False:
        pt_id = PersonalTrainersRepository.get_pt_by_token(token=jwt_data["token"]).id
        if pt_id == None:
            return { "result": "no", "error": "Unauthorized." }

        users_info = SubscriptionsRepository.get_users_for_pt(pt_id)
        if users_info != None:
            users_info = [{"id": user.id, "name": user.username, "photo": ""} for user in users_info]
        else:
            users_info = []
        return { "result": "ok", "users": users_info}
    else:
        return { "result": "no", "error": "Unauthorized." }

@router.post("/subscribeToPT/{pt_id}")
def subscribe_to_pt(token: schemas.TokenData, pt_id: int):
    jwt_data: Optional[str] = get_jwt_token_data(token=token.token)
    if jwt_data == None:
        return { "result": "no", "error": "Unauthorized." }
    if jwt_data["isNormalUser"] == True:
        user_id: int = UsersRepository.get_user_by_token(token=jwt_data["token"]).id
        if user_id == None:
            return { "result": "no", "error": "Unauthorized." }
        SubscriptionsRepository.create(user_id, pt_id)
        return { "result": "ok" }
    else:
        return { "result": "no", "error": "Unauthorized." }

@router.post("/getNewPts")
async def get_new_pts(token: schemas.TokenData):
    jwt_data: Optional[str] = get_jwt_token_data(token=token.token)
    if jwt_data == None:
        return { "result": "no", "error": "Unauthorized." }

    if jwt_data["isNormalUser"] == True:
        user_id: int = UsersRepository.get_user_by_token(token=jwt_data["token"]).id
        if user_id == None:
            return { "result": "no", "error": "Unauthorized." }

        pts = PersonalTrainersRepository.get_new_pts(user_id)
        pts = [{"id":pt.id, "name":pt.name, "description":pt.description, "tags":pt.tags, "photo":pt.photo, "price":pt.price} for pt in pts]
        return {"result":"ok","pts":pts}
    else:
            return { "result": "no", "error": "Unauthorized." }
    

@router.post("/safePTNewExerciseDetails")
async def safe_pt_new_exercise_details(token: schemas.TokenData, exercisedetails: schemas.NewExerciseDetails):
    jwt_data: Optional[str] = get_jwt_token_data(token=token.token)
    if jwt_data == None:
        return { "result": "no", "error": "Unauthorized." }

    if jwt_data["isNormalUser"] == False:
        pt_id = PersonalTrainersRepository.get_pt_by_token(token=jwt_data["token"]).id
        if pt_id == None:
            return { "result": "no", "error": "Unauthorized." }
        #PersonalTrainersRepository.check_exercise_table()
        exercise_id = PersonalTrainersRepository.create_exercise(pt_id, exercisedetails.model_dump())
        return { "result": "ok", "exercise_id": exercise_id}
    else:
        return { "result": "no", "error": "Unauthorized." }
    
@router.post("/safePTNewExerciseVideo")
async def safe_pt_new_exercise_video(video: UploadFile):
    # Extrair pt_id do nome do arquivo
    exercise_id = int(video.filename.replace('.mp4', '').split('_')[1])
    # Max size is 100 MB ---> (maybe more? idk)
    max_size_in_bytes = 100 * 1024 * 1024
    content_length = 0
    while True:
        data = video.file.read(8192)
        if not data:
            break
        content_length += len(data)
        if content_length > max_size_in_bytes:
            return {"result": "no", "error": "The file size exceeds the maximum size (100 MB). Please choose another video."}
        
    # save the video file
    with open('./videos/' + video.filename, 'wb') as f:
        # reset file pointer to the beginning of the file
        video.file.seek(0)
        while True:
            data = video.file.read(8192)
            if not data:
                break
            f.write(data)

    PersonalTrainersRepository.save_exercise_videopath(video.filename,exercise_id)
    return { "result": "ok" }

@router.post("/safePTNewExerciseThumbnail")
async def safe_pt_new_exercise_thumbnail(thumbnail: UploadFile = File(...)):
    # Extrair exercise_id do nome do arquivo
    exercise_id = int(thumbnail.filename.replace('.png', '').split('_')[2])
    # Max size is 5 MB
    max_size_in_bytes = 5 * 1024 * 1024
    content_length = 0
    while True:
        data = thumbnail.file.read(8192)
        if not data:
            break
        content_length += len(data)
        if content_length > max_size_in_bytes:
            return {"result": "no", "error": "The file size exceeds the maximum size (5 MB). Please choose another image."}
        
    # save the thumbnail file
    with open('./images/thumbnails/' + thumbnail.filename, 'wb') as f:
        # reset file pointer to the beginning of the file
        thumbnail.file.seek(0)
        while True:
            data = thumbnail.file.read(8192)
            if not data:
                break
            f.write(data)

    PersonalTrainersRepository.save_exercise_thumbnailpath(thumbnail.filename,exercise_id)
    return { "result": "ok" }

@router.post("/safePTNewExerciseCommonMistakeDescription")
async def safe_pt_new_exercise_common_mistake_description(description: schemas.NewCommonMistake):
    #PersonalTrainersRepository.check_common_mistake_table()
    common_mistake_id = PersonalTrainersRepository.save_common_mistake_description(description.model_dump())
    return { "result": "ok" , "common_mistake_id": common_mistake_id }

@router.post("/safePTNewExerciseCommonMistakeVideo")
async def safe_pt_new_exercise_common_mistake_video(video: UploadFile):
    #PersonalTrainersRepository.check_common_mistake_table()
    # Extrair exercise_id do nome do arquivo
    common_mistake_id = int(video.filename.replace('.mp4', '').split('_')[2])
    # Max size is 100 MB ---> (maybe more? idk)
    max_size_in_bytes = 100 * 1024 * 1024
    content_length = 0
    while True:
        data = video.file.read(8192)
        if not data:
            break
        content_length += len(data)
        if content_length > max_size_in_bytes:
            return {"result": "no", "error": "The file size exceeds the maximum size (100 MB). Please choose another video."}
        
    # save the video file
    with open('./videos/common_mistakes/' + video.filename, 'wb') as f:
        # reset file pointer to the beginning of the file
        video.file.seek(0)
        while True:
            data = video.file.read(8192)
            if not data:
                break
            f.write(data)

    # save and create the common mistake video
    PersonalTrainersRepository.save_common_mistake_videopath(video.filename,common_mistake_id)
    return { "result": "ok" }





# @router.post("/addUserCustom", response_model=schemas.BasicUser)
# async def read_root2(user: schemas.BasicUser):
#     # add a user with name 'user2' and password 'password'
#     UsersRepository.create(new_user)
#     return new_user
# @router.post("/add")
# async def read_root2(username,password):
#     # add a user with name 'user3' and password 'password'
#     newUser = User(username=username, password=password)
#     UsersRepository.create(newUser)
#     return newUser
# @router.post("/getAll")
# async def read_root2():
#     users = UsersRepository.get_users()
#     print(users)
#     return users
# @router.post("/getSubs")
# async def read_root3():
#     user_id=5
#     PTs_info = SubscriptionsRepository.get_pts_for_user(user_id)
#     return { "result": "ok", "pts": PTs_info if PTs_info != None else [] }
# @router.post("/addPTCustom",response_model=schemas.BasicPersonalTrainer)
# async def add_pt(pt: schemas.BasicPersonalTrainer):
#     new_pt = PersonalTrainer(**pt.model_dump())
#     PersonalTrainersRepository.create(new_pt)
#     return new_pt   
# @router.post("/add")
# async def add_PT():
#     # add a pt with name 'PT3' and password '123'
#     newPT = PersonalTrainer(username="PT3", password="123",token="")
#     PersonalTrainersRepository.create(newPT)
#     return newPT    
# @router.post("/getPTbyUsername")
# async def get_PT_by_username(username):
#     pt = PersonalTrainersRepository.get_pt_by_username(username)
#     print(pt)
#     return pt
# @router.post("/getAll")
# async def get_all():
#     pts = PersonalTrainersRepository.get_pts()
#     return {"result":"ok","pts":pts}
