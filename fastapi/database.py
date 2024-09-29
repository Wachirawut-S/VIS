# database.py
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

# Function to insert a new user into the users table
async def insert_user(username: str, password_hash: str, email: str, status: int = 0):
    query = """
    INSERT INTO users (username, password_hash, email, status)
    VALUES (:username, :password_hash, :email, :status)
    RETURNING user_id, username, password_hash, email, created_at, status
    """
    values = {"username": username, "password_hash": password_hash, "email": email, "status": status}
    return await database.fetch_one(query=query, values=values)

# Function to select a user by username from the users table
async def get_user(username: str):
    query = "SELECT * FROM users WHERE username = :username"
    return await database.fetch_one(query=query, values={"username": username})

# Function to select a user by user_id from the users table
async def get_user_by_id(user_id: int):
    query = "SELECT * FROM users WHERE user_id = :user_id"
    return await database.fetch_one(query=query, values={"user_id": user_id})

# Function to select a user by email from the users table
async def get_user_by_email(email: str):
    query = "SELECT * FROM users WHERE email = :email"
    return await database.fetch_one(query=query, values={"email": email})

# Function to update a user in the users table
async def update_user(user_id: int, username: str, password_hash: str, email: str):
    query = """
    UPDATE users
    SET username = :username, password_hash = :password_hash, email = :email
    WHERE user_id = :user_id
    RETURNING user_id, username, password_hash, email, created_at, status
    """
    values = {"user_id": user_id, "username": username, "password_hash": password_hash, "email": email}
    return await database.fetch_one(query=query, values=values)

# Function to delete a user from the users table
async def delete_user(user_id: int):
    query = "DELETE FROM users WHERE user_id = :user_id RETURNING *"
    return await database.fetch_one(query=query, values={"user_id": user_id})
