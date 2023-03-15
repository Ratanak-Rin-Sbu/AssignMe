import motor.motor_asyncio
import asyncio
import motor.core
from fastapi import FastAPI, HTTPException, Depends, Request, status
from model import Todo, UpdateTodoModel, Event, UpdateEventModel, Note, UpdateNoteModel
from models.user_model import User, TokenSchema, TokenPayload
from fastapi import Body
from PyObjectId import PyObjectId
from fastapi.middleware.cors import CORSMiddleware

# authentication
from typing import Any, Optional
from fastapi.security import OAuth2PasswordRequestForm
from core.config import settings
from core.security import get_password, verify_password, create_access_token, create_refresh_token
from jose import jwt
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime
from pydantic import ValidationError

app = FastAPI()

# DATABASE SETUP
client = motor.motor_asyncio.AsyncIOMotorClient('mongodb+srv://jassonrin:stfuimissHER0730@cluster0.4wfy1nc.mongodb.net/?retryWrites=true&w=majority')
client.get_io_loop = asyncio.get_running_loop
# Todo DB
todoDB = client.TodoList
todoCollection = todoDB.todo
# Event DB
eventDB = client.EventList
eventCollection = eventDB.event
# Note DB
noteDB = client.NoteList
noteCollection = noteDB.note
# User DB
userDB = client.UserList
userCollection = userDB.user

# what is a middleware? 
# software that acts as a bridge between an operating system or database and applications, especially on a network.

# CORS SETUP
origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTES
@app.get("/")
def read_root():
	return {"data":"Hello World"}

# USER
# TOKEN
reuseable_oauth = OAuth2PasswordBearer(
    tokenUrl = "/login",
    scheme_name = "JWT"
)

async def get_current_user(token: str = Depends(reuseable_oauth)) -> User:
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms = [settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)

        if datetime.fromtimestamp(token_data.exp) < datetime.now():
          raise HTTPException (
              status_code = status.HTTP_401_UNAUTHORIZED,
              detail = "Token expired",
              headers = {"WWW-Authenticate": "Bearer"},
          )
    except(jwt.JWTError, ValidationError):
      raise HTTPException (
            status_code = status.HTTP_403_FORBIDDEN,
            detail = "Could not validate credentials",
            headers = {"WWW-Authenticate": "Bearer"},
        )
    user = await userCollection.find_one({'id': {'$eq': token_data.sub}})

    if not user:
        raise HTTPException(404, "Could not find user")
    
    return user

# REGISTER USER
async def create_user(user):
    document = user
    result = await userCollection.insert_one(document)
    return document

@app.post("/api/user", response_model=User)
async def post_user(user: User):
    existed_username = await userCollection.find_one({'username': {'$eq': user.username}})
    existed_email = await userCollection.find_one({'email': {'$eq': user.email}})
    if existed_username or existed_email:
        raise HTTPException(403, "Username or email already exists")
    else:
        user = user.dict()
        user["hashed_password"] = get_password(user["hashed_password"])
        response = await create_user(user)
        if response:
            return response
        else:
            raise HTTPException(400, "Something went wrong")
        
# LOGIN
async def authenticate(email: str, password: str) -> Optional[User]:
    user = await userCollection.find_one({'email': {'$eq': email}})
    if not user:
        return None
    if not verify_password(password=password, hashed_pass=user["hashed_password"]):
        return None
    return user

@app.post("/login", summary="Create access and refresh tokens for user", response_model=TokenSchema)
async def login(form: OAuth2PasswordRequestForm = Depends()) -> Any:
    user = await authenticate(email=form.username, password=form.password)
    if not user:
        raise HTTPException(400, "Incorrect email or password")
    return {
        "access_token": create_access_token(user["id"]),
        "refresh_token": create_refresh_token(user["id"]),
    }

@app.post("/test-token", summary="Test is the access token is valid", response_model=User)
async def test_token(user: User = Depends(get_current_user)):
    return user

@app.post('/refresh', summary="Refresh token", response_model=TokenSchema)
async def refresh_token(refresh_token: str = Body(...)):
    try:
        payload = jwt.decode(
            refresh_token, settings.JWT_REFRESH_SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = await userCollection.find_one({'id': {'$eq': token_data.sub}})
    if not user:
        raise HTTPException(404, "Invalid token for user")
    return {
        "access_token": create_access_token(user["id"]),
        "refresh_token": create_refresh_token(user["id"]),
    }

# TASK MANAGER
# GET ONE TASK
async def fetch_one_todo(id):
    document = await todoCollection.find_one({"id": id})
    return document

@app.get("/api/todo/{id}", response_model=Todo)
async def get_todo_by_id(id: PyObjectId):
    response = await fetch_one_todo(id)
    if response:
        return response
    raise HTTPException(404, f"There is no todo with the id {id}")

# GET ALL TASKS
async def fetch_all_todos():
    todos = []
    cursor = todoCollection.find({})
    async for document in cursor:
        todos.append(Todo(**document))
    return todos

@app.get("/api/todos")
async def get_todo():
    response = await fetch_all_todos()
    return response

# CREATE A TASK
async def create_todo(todo):
    document = todo
    result = await todoCollection.insert_one(document)
    return document

@app.post("/api/todo", response_model=Todo)
async def post_todo(todo: Todo):
    response = await create_todo(todo.dict())
    if response:
        return response
    raise HTTPException(400, "Something went wrong")

# UPDATE A TASK (STATUS ONLY FOR NOW)
async def update_todo(id: PyObjectId, todo: UpdateTodoModel):
    if todo.subject != None:
        await todoCollection.update_one({"id": id}, {"$set": {"subject": todo.subject}})
    if todo.description != None:
        await todoCollection.update_one({"id": id}, {"$set": {"description": todo.description}})
    if todo.deadline != None:
        await todoCollection.update_one({"id": id}, {"$set": {"deadline": todo.deadline}})
    if todo.status != None:
        await todoCollection.update_one({"id": id}, {"$set": {"status": todo.status}})
    document = await todoCollection.find_one({"id": id})
    return document

@app.put("/api/todo/{id}", response_model=Todo)
async def put_todo(id: PyObjectId, todo: UpdateTodoModel):
    response = await update_todo(id, todo)
    if response:
        return response
    raise HTTPException(404, f"There is no todo with the id {id}")

# DELETE A TASK
async def remove_todo(id: PyObjectId):
    await todoCollection.delete_one({"id": id})
    return True

@app.delete("/api/todo/{id}")
async def delete_todo(id: PyObjectId):
    response = await remove_todo(id)
    if response:
        return "Successfully deleted todo"
    raise HTTPException(404, f"There is no todo with the id {id}")

# EVENT
# GET ONE EVENT
async def fetch_one_event(id):
    document = await eventCollection.find_one({"id": id})
    return document

@app.get("/api/event/{id}", response_model=Event)
async def get_event_by_id(id: PyObjectId):
    response = await fetch_one_event(id)
    if response:
        return response
    raise HTTPException(404, f"There is no event with the id {id}")

# GET ALL EVENTS
async def fetch_all_events():
    events = []
    cursor = eventCollection.find({})
    async for document in cursor:
        events.append(Event(**document))
    return events

@app.get("/api/events")
async def get_events():
    response = await fetch_all_events()
    return response

# CREATE AN EVENT
async def create_event(event):
    document = event
    result = await eventCollection.insert_one(document)
    return document

@app.post("/api/event", response_model=Event)
async def post_event(event: Event):
    response = await create_event(event.dict())
    if response:
        return response
    raise HTTPException(400, "Something went wrong")

# UPDATE AN EVENT
async def update_event(id: PyObjectId, event: UpdateEventModel):
    if event.name != None:
        await eventCollection.update_one({"id": id}, {"$set": {"name": event.name}})
    if event.place != None:
        await eventCollection.update_one({"id": id}, {"$set": {"place": event.place}})
    if event.start != None:
        await eventCollection.update_one({"id": id}, {"$set": {"start": event.start}})
    if event.end != None:
        await eventCollection.update_one({"id": id}, {"$set": {"end": event.end}})
    if event.color != None:
        await eventCollection.update_one({"id": id}, {"$set": {"color": event.color}})
    if event.days != None:
        await eventCollection.update_one({"id": id}, {"$set": {"days": event.days}})
    document = await eventCollection.find_one({"id": id})
    return document

@app.put("/api/event/{id}", response_model=Event)
async def put_event(id: PyObjectId, event: UpdateEventModel):
    response = await update_event(id, event)
    if response:
        return response
    raise HTTPException(404, f"There is no event with the id {id}")

# DELETE A EVENT
async def remove_event(id: PyObjectId):
    await eventCollection.delete_one({"id": id})
    return True

@app.delete("/api/event/{id}")
async def delete_event(id: PyObjectId):
    response = await remove_event(id)
    if response:
        return "Successfully deleted event"
    raise HTTPException(404, f"There is no event with the id {id}")

# Note
# GET ONE Note
async def fetch_one_note(id):
    document = await noteCollection.find_one({"id": id})
    return document

@app.get("/api/note/{id}", response_model=Todo)
async def get_note_by_id(id: PyObjectId):
    response = await fetch_one_note(id)
    if response:
        return response
    raise HTTPException(404, f"There is no note with the id {id}")

# GET ALL notes
async def fetch_all_notes():
    notes = []
    cursor = noteCollection.find({})
    async for document in cursor:
        notes.append(Note(**document))
    return notes

@app.get("/api/notes")
async def get_note():
    response = await fetch_all_notes()
    return response

# CREATE A Note
async def create_note(note):
    document = note
    result = await noteCollection.insert_one(document)
    return document

@app.post("/api/note", response_model=Note)
async def post_note(note: Note):
    response = await create_note(note.dict())
    if response:
        return response
    raise HTTPException(400, "Something went wrong")

# UPDATE A Note
async def update_note(id: PyObjectId, note: UpdateNoteModel):
    if note.note != None:
        await noteCollection.update_one({"id": id}, {"$set": {"note": note.note}})
    if note.tags != None:
        await noteCollection.update_one({"id": id}, {"$set": {"tags": note.tags}})
    if note.lastUpdated != None:
        await noteCollection.update_one({"id": id}, {"$set": {"lastUpdated": note.lastUpdated}})
    if note.active != None:
        await noteCollection.update_one({"id": id}, {"$set": {"active": note.active}})
    document = await noteCollection.find_one({"id": id})
    return document

@app.put("/api/note/{id}", response_model=Note)
async def put_note(id: PyObjectId, note: UpdateNoteModel):
    response = await update_note(id, note)
    if response:
        return response
    raise HTTPException(404, f"There is no note with the id {id}")

# DELETE A Note
async def remove_note(id: PyObjectId):
    await noteCollection.delete_one({"id": id})
    return True

@app.delete("/api/note/{id}")
async def delete_note(id: PyObjectId):
    response = await remove_note(id)
    if response:
        return "Successfully deleted note"
    raise HTTPException(404, f"There is no note with the id {id}")