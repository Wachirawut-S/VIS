from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import bcrypt

from database import (
    connect_db,
    disconnect_db,
    get_db,
    insert_user,
    get_user,
    get_all_sp500,
    get_all_nasdaq100
)
from dependencies import get_current_user
from routes.models import Post, User, Comment  # Ensure Comment is imported

app = FastAPI()

# Schemas for Pydantic
class PostSchema(BaseModel):
    title: str
    content: str

class CommentSchema(BaseModel):  # Define the CommentSchema
    content: str

class UserCreateSchema(BaseModel):
    username: str
    email: str
    password: str

# Create Post API
@app.post('/posts/')
def create_post(post: PostSchema, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    new_post = Post(title=post.title, content=post.content, user_id=user.user_id)
    db.add(new_post)
    db.commit()
    return new_post

# Get All Posts API
@app.get('/posts/')
def get_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Post).offset(skip).limit(limit).all()

# Create Comment API
@app.post('/posts/{post_id}/comments/')
def create_comment(post_id: int, comment: CommentSchema, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    new_comment = Comment(content=comment.content, post_id=post_id, user_id=user.user_id)
    db.add(new_comment)
    db.commit()
    return new_comment

# User registration
@app.post("/users/")
async def register_user(user: UserCreateSchema):
    existing_user = await get_user(user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    return await insert_user(username=user.username, password_hash=hashed_password, email=user.email)

# Fetch SP500 data
@app.get("/sp500/")
async def sp500_data():
    return await get_all_sp500()

# Fetch Nasdaq100 data
@app.get("/nasdaq100/")
async def nasdaq100_data():
    return await get_all_nasdaq100()

# Startup and shutdown events
@app.on_event("startup")
async def startup():
    await connect_db()  # Connect to the database

@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()  # Disconnect from the database
