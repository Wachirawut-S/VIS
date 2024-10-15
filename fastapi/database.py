from databases import Database
import bcrypt

POSTGRES_USER = "temp"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "advcompro"
POSTGRES_HOST = "db"

DATABASE_URL = f'postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DB}'

database = Database(DATABASE_URL)

# Function to hash the plain password
def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_password.encode(), salt)
    return hashed.decode()

# Function to verify a plain password against the hashed password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

async def connect_db():
    await database.connect()
    print("Database connected")

async def disconnect_db():
    await database.disconnect()
    print("Database disconnected")

# User-related functions
async def insert_user(username: str, password_hash: str, email: str, status: int = 0):
    query = """
    INSERT INTO users (username, password_hash, email, status)
    VALUES (:username, :password_hash, :email, :status)
    RETURNING user_id, username, password_hash, email, created_at, status
    """
    values = {"username": username, "password_hash": password_hash, "email": email, "status": status}
    return await database.fetch_one(query=query, values=values)

async def get_user(username: str):
    query = "SELECT * FROM users WHERE username = :username"
    return await database.fetch_one(query=query, values={"username": username})

async def get_user_by_id(user_id: int):
    query = "SELECT * FROM users WHERE user_id = :user_id"
    return await database.fetch_one(query=query, values={"user_id": user_id})

async def get_user_by_email(email: str):
    query = "SELECT * FROM users WHERE email = :email"
    return await database.fetch_one(query=query, values={"email": email})

async def update_user(user_id: int, username: str, password_hash: str, email: str):
    query = """
    UPDATE users
    SET username = :username, password_hash = :password_hash, email = :email
    WHERE user_id = :user_id
    RETURNING user_id, username, password_hash, email, created_at, status
    """
    values = {"user_id": user_id, "username": username, "password_hash": password_hash, "email": email}
    return await database.fetch_one(query=query, values=values)

async def delete_user(user_id: int):
    query = "DELETE FROM users WHERE user_id = :user_id RETURNING *"
    return await database.fetch_one(query=query, values={"user_id": user_id})

# Function to select all in indexfunds
async def get_all_sp500():
    query = "SELECT * FROM SP500"
    return await database.fetch_all(query)

async def get_all_Nasdaq100():
    query = "SELECT * FROM Nasdaq100"
    return await database.fetch_all(query)

# Functions for Calculation History

async def insert_calculation_history(data: dict):
    query = """
    INSERT INTO calculation (user_id, username, company_name, stock_price, intrinsic_value, margin_of_safety, 
                             rating, gross_profit_margin, return_on_equity, roic, sga_to_revenue, 
                             debt_to_equity, current_ratio, cash_ratio, quick_ratio, roa)
    VALUES (:user_id, :username, :company_name, :stock_price, :intrinsic_value, :margin_of_safety, 
            :rating, :gross_profit_margin, :return_on_equity, :roic, :sga_to_revenue, 
            :debt_to_equity, :current_ratio, :cash_ratio, :quick_ratio, :roa)
    RETURNING *
    """
    return await database.fetch_one(query=query, values=data)

async def get_calculation_history_by_user_id(user_id: int):
    query = "SELECT * FROM calculation WHERE user_id = :user_id"
    return await database.fetch_all(query=query, values={"user_id": user_id})

async def delete_calculation_history(history_id: int):
    query = "DELETE FROM calculation WHERE history_id = :history_id RETURNING *"
    return await database.fetch_one(query=query, values={"history_id": history_id})

# Functions for Forum
async def insert_forum_post(user_id: int, title: str, content: str):
    query = """
    INSERT INTO forumPost (user_id, title, content)
    VALUES (:user_id, :title, :content)
    RETURNING forum_id, user_id, title, content, created_at
    """
    values = {"user_id": user_id, "title": title, "content": content}
    return await database.fetch_one(query=query, values=values)

async def get_latest_forum_posts():
    query = """
    SELECT forumPost.forum_id, forumPost.user_id, forumPost.title, forumPost.content, forumPost.created_at, users.username 
    FROM forumPost 
    JOIN users ON forumPost.user_id = users.user_id
    ORDER BY forumPost.created_at DESC
    """
    return await database.fetch_all(query)

# Update a forum post
async def update_forum_post(forum_id: int, title: str, content: str):
    query = """
    UPDATE forumPost 
    SET title = :title, content = :content 
    WHERE forum_id = :forum_id
    RETURNING forum_id, user_id, title, content, created_at
    """
    values = {"forum_id": forum_id, "title": title, "content": content}
    return await database.fetch_one(query=query, values=values)

# Delete a forum post
async def delete_forum_post(forum_id: int):
    try:
        query = "DELETE FROM forumPost WHERE forum_id = :forum_id RETURNING *"
        values = {"forum_id": forum_id}
        result = await database.fetch_one(query=query, values=values)
        print(f"Deleted forum post: {result}")  # Log the result of the delete operation
        return result
    except Exception as e:
        print(f"Database error when deleting forum post {forum_id}: {str(e)}")
        raise

# Functions for Forum Replies
async def insert_forum_reply(user_id: int, forum_id: int, content: str):
    query = """
    INSERT INTO forumReply (user_id, forum_id, content)
    VALUES (:user_id, :forum_id, :content)
    RETURNING reply_id, user_id, forum_id, content, created_at
    """
    values = {"user_id": user_id, "forum_id": forum_id, "content": content}
    return await database.fetch_one(query=query, values=values)

async def get_replies_for_post(forum_id: int):
    query = """
    SELECT forumReply.reply_id, forumReply.user_id, forumReply.forum_id, forumReply.content, forumReply.created_at, users.username
    FROM forumReply
    JOIN users ON forumReply.user_id = users.user_id
    WHERE forumReply.forum_id = :forum_id
    ORDER BY forumReply.created_at ASC
    """
    return await database.fetch_all(query=query, values={"forum_id": forum_id})

async def delete_forum_reply(reply_id: int):
    query = "DELETE FROM forumReply WHERE reply_id = :reply_id RETURNING *"
    return await database.fetch_one(query=query, values={"reply_id": reply_id})
