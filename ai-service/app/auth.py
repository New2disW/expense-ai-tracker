import os
import jwt
from fastapi import Header, HTTPException, Depends

JWT_SECRET = os.getenv("JWT_SECRET", "your_jwt_secret_here")
SERVICE_SECRET = os.getenv("SERVICE_SECRET", "your_service_secret_here")

def verify_jwt_token(authorization: str = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return {"user_id": payload.get("id"), "token": token}
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid JWT token")

def verify_service_secret(x_service_secret: str = Header(None)):
    if not x_service_secret or x_service_secret != SERVICE_SECRET:
        raise HTTPException(status_code=403, detail="Invalid Service Secret")
