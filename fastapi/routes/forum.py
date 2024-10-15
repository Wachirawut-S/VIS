from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import (
    insert_forum_post,
    get_latest_forum_posts,
    update_forum_post,
    delete_forum_post,
    insert_forum_reply,
    get_replies_for_post,
    delete_forum_reply,
)
from typing import Optional, List
from datetime import datetime

router = APIRouter()

# Models for posts and replies
class ForumPostCreate(BaseModel):
    user_id: int
    title: str
    content: str

class ForumPostUpdate(BaseModel):
    title: str
    content: str

class ForumPost(BaseModel):
    forum_id: Optional[int]
    user_id: int
    title: str
    content: str
    created_at: Optional[datetime]
    username: str

class ForumReplyCreate(BaseModel):
    user_id: int
    forum_id: int
    content: str

class ForumReply(BaseModel):
    reply_id: Optional[int]
    user_id: int
    forum_id: int
    content: str
    created_at: Optional[datetime]
    username: str

# Create a forum reply
@router.post("/forum/reply")
async def create_forum_reply(reply: ForumReplyCreate):
    result = await insert_forum_reply(reply.user_id, reply.forum_id, reply.content)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to create forum reply")
    return {"message": "Reply created successfully", "reply": result}

# Fetch replies for a specific forum post
@router.get("/forum/{forum_id}/replies", response_model=List[ForumReply])
async def get_replies(forum_id: int):
    replies = await get_replies_for_post(forum_id)
    if not replies:
        raise HTTPException(status_code=404, detail="No replies found for this post")
    return replies

# Delete a forum reply
@router.delete("/forum/reply/delete/{reply_id}")
async def delete_reply(reply_id: int):
    result = await delete_forum_reply(reply_id)
    if not result:
        raise HTTPException(status_code=404, detail="Reply not found")
    return {"message": "Reply deleted successfully"}

# Create a new forum post
@router.post("/forum/create")
async def create_forum_post(post: ForumPostCreate):
    result = await insert_forum_post(post.user_id, post.title, post.content)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to create forum post")
    return {"message": "Post created successfully"}

# Fetching latest forum posts
@router.get("/forum", response_model=List[ForumPost])
async def get_latest_posts():
    result = await get_latest_forum_posts()
    if not result:
        raise HTTPException(status_code=404, detail="No forum posts found")
    return result

# Edit a forum post
@router.put("/forum/edit/{forum_id}")
async def edit_forum_post(forum_id: int, post: ForumPostUpdate):
    result = await update_forum_post(forum_id, post.title, post.content)
    if not result:
        raise HTTPException(status_code=404, detail="Forum post not found or failed to update")
    return {"message": "Post updated successfully", "post": result}

# Delete a forum post
@router.delete("/forum/delete/{forum_id}")
async def delete_forum_post(forum_id: int):
    try:
        result = await delete_forum_post(forum_id)
        if not result:
            raise HTTPException(status_code=404, detail="Forum post not found")
        return {"message": "Post deleted successfully"}
    except Exception as e:
        print(f"Error deleting forum post {forum_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
