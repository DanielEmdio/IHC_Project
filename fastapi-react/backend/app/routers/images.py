from fastapi.responses import FileResponse
from fastapi import APIRouter
from auth.oauth2_jwt import *
from pathlib import Path

IMAGES_DIR = Path("images")
router = APIRouter(prefix="/images")

def is_safe_path(image_name: str) -> bool:
    # basic directory traversal mitigation
    return not (".." in image_name or "\\" in image_name or "/" in image_name)

@router.get("/{image_name}")
async def get_image(image_name: str):
    # jwt_data = get_jwt_token_data(token=token.token)
    # if jwt_data == None:
    #     return { "result": "no", "error": "Unauthorized." }
    # if jwt_data["isNormalUser"] == True:
    #     user_id: int = UsersRepository.get_user_by_token(token=jwt_data["token"]).id
    #     if not UsersRepository.hasAccessToImage(user_id, image_name):
    #         return { "result": "no", "error": "Unauthorized." }
    # else:
    #     pt_id: int = PersonalTrainersRepository.get_pt_by_token(token=jwt_data["token"]).id
    #     if not PersonalTrainersRepository.hasAccessToImage(pt_id, image_name):
    #         return { "result": "no", "error": "Unauthorized." }

    if not is_safe_path(image_name):
        return { "result": "no", "error": "Image not safe." }

    image_name = IMAGES_DIR / image_name
    if not image_name.exists():
        return { "result": "no", "error": "Image not found." }

    return FileResponse(image_name)

@router.get("/thumbnails/{image_name}")
async def get_image(image_name: str):
    # jwt_data = get_jwt_token_data(token=token.token)
    # if jwt_data == None:
    #     return { "result": "no", "error": "Unauthorized." }
    # if jwt_data["isNormalUser"] == True:
    #     user_id: int = UsersRepository.get_user_by_token(token=jwt_data["token"]).id
    #     if not UsersRepository.hasAccessToImage(user_id, image_name):
    #         return { "result": "no", "error": "Unauthorized." }
    # else:
    #     pt_id: int = PersonalTrainersRepository.get_pt_by_token(token=jwt_data["token"]).id
    #     if not PersonalTrainersRepository.hasAccessToImage(pt_id, image_name):
    #         return { "result": "no", "error": "Unauthorized." }

    if not is_safe_path(image_name):
        return { "result": "no", "error": "Image not safe." }

    image_name = "thumbnails/" + image_name
    image_name = IMAGES_DIR / image_name 

    if not image_name.exists():
        return { "result": "no", "error": "Image not found." }

    return FileResponse(image_name)
