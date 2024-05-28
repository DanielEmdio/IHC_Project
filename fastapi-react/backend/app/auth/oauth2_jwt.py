from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta, datetime, timezone
from typing import Optional
from jose import jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/login')

SECRET_KEY = "efb54779239f73b8c2ab435c965efb930a6677028c3e72bbf0d9dc84eed234e4"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
ALGORITHM = "HS256"

def create_jwt_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"expire": expire.strftime("%Y-%m-%d %H:%M:%S")})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, ALGORITHM)
    return encoded_jwt

def get_jwt_token_data(token: str) -> Optional[dict]:
    # try to decode the data (also checks the signature)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
    except:
        return None

    # return token_data
    return payload
