# models.py

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    email = Column(String, unique=True, index=True)
    status = Column(Integer)

class Post(Base):
    __tablename__ = 'posts'
    post_id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(String)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    user = relationship("User", back_populates="posts")

class Comment(Base):
    __tablename__ = 'comments'

    comment_id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    post_id = Column(Integer, ForeignKey('posts.post_id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)

    post = relationship("Post", back_populates="comments")
    user = relationship("User", back_populates="comments")

# Relationships
User.posts = relationship("Post", back_populates="user", cascade="all, delete-orphan")
Post.comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
User.comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
