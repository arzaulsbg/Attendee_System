from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
from enum import Enum
from jose import JWTError, jwt
from datetime import datetime, timedelta
import base64
import uuid
import os

# Secret key for JWT
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded face images as static files
UPLOAD_DIR = "uploads/faces"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/static/faces", StaticFiles(directory=UPLOAD_DIR), name="faces")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

# User roles
class Role(str, Enum):
    student = "student"
    faculty = "faculty"
    admin = "admin"

# User model
class User(BaseModel):
    username: str
    role: Role
    device_id: Optional[str] = None

# Token model
class Token(BaseModel):
    access_token: str
    token_type: str

# Face image upload model
class FaceImageRequest(BaseModel):
    image_base64: str

# Dummy user DB
fake_users_db = {
    "student1": {"username": "student1", "role": Role.student, "device_id": None},
    "faculty1": {"username": "faculty1", "role": Role.faculty, "device_id": None},
    "admin1": {"username": "admin1", "role": Role.admin, "device_id": None},
}

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = fake_users_db.get(username)
    if user is None:
        raise credentials_exception
    return User(**user)

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_dict = fake_users_db.get(form_data.username)
    if not user_dict:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    # Device binding: check device_id if present
    # For demo, skip password and device check
    access_token = create_access_token(data={"sub": user_dict["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/attendance")
async def get_attendance(current_user: User = Depends(get_current_user)):
    # Role-based access
    if current_user.role == Role.student:
        return {"attendance": "Student attendance data"}
    elif current_user.role == Role.faculty:
        return {"attendance": "Faculty class attendance data"}
    elif current_user.role == Role.admin:
        return {"attendance": "Admin analytics data"}
    else:
        raise HTTPException(status_code=403, detail="Invalid role")

@app.get("/admin/users")
async def admin_users(current_user: User = Depends(get_current_user)):
    if current_user.role != Role.admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return list(fake_users_db.values())

# Face image upload endpoint
@app.post("/upload-face-image")
async def upload_face_image(data: FaceImageRequest):
    try:
        header, _, b64data = data.image_base64.partition(',')
        if b64data:
            image_data = base64.b64decode(b64data)
        else:
            image_data = base64.b64decode(data.image_base64)
        filename = f"{uuid.uuid4().hex}.png"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as f:
            f.write(image_data)
        file_url = f"/static/faces/{filename}"
        return {"url": file_url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Add more endpoints for device binding, face verification, analytics, etc.