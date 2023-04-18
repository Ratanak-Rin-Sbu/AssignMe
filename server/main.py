import motor.motor_asyncio
import asyncio
import motor.core
import json
from fastapi import FastAPI, HTTPException, Depends, Request, status
from model import Todo, UpdateTodoModel, Event, UpdateEventModel, Note, UpdateNoteModel
from models.user_model import User, UserOut, TokenSchema, TokenPayload
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

app = FastAPI(
    title="AssignME",
)

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

@app.post("/user", response_model=User)
async def post_user(user: User):
    existed_username = await userCollection.find_one({'username': {'$eq': user.username}})
    existed_email = await userCollection.find_one({'email': {'$eq': user.email}})
    if existed_username or existed_email:
        raise HTTPException(403, "Username or email already exists")
    else:
        user = user.dict()
        user["password"] = get_password(user["password"])
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
    if not verify_password(password=password, hashed_pass=user["password"]):
        return None
    return user

@app.post("/login", summary="Create access and refresh tokens for user")
async def login(userr: UserOut):
    user = await authenticate(userr.email, userr.password)
    if not user:
        raise HTTPException(400, "Incorrect email or password")
    return {
        "access_token": create_access_token(user["id"]),
        "user": {
            "_id": str(user["_id"]),
            "id": str(user["id"]),
            "username": user["username"],
            "email": user["email"],
            "password": user["password"],
            "picture": user["picture"]
        },
    }

@app.get('/me', summary='Get details of currently logged in user', response_model=UserOut)
async def get_me(user: User = Depends(get_current_user)):
    return user

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

# TASK MANAGER II
# GET ONE TASK
async def fetch_one_todo(id, userId):
    document = await todoCollection.find_one({"id": id, "owner_id": userId})
    return document

@app.get("/api/{userId}/todo/{id}", response_model=Todo)
async def get_todo_by_id(id: PyObjectId, userId: PyObjectId):
    response = await fetch_one_todo(id, userId)
    if response:
        return response
    raise HTTPException(404, f"There is no todo with the id {id}")

# GET ALL TASKS
async def fetch_all_todos(userId):
    todos = []
    cursor = todoCollection.find({})
    async for document in cursor:
        if document["owner_id"] == userId:
            todos.append(Todo(**document))
    return todos

@app.get("/api/{userId}/todos")
async def get_todo(userId):
    response = await fetch_all_todos(userId)
    return response

# CREATE A TASK
async def create_todo(todo, userId):
    document = todo
    document["owner_id"] = userId
    result = await todoCollection.insert_one(document)
    return document

@app.post("/api/{userId}/todo", response_model=Todo)
async def post_todo(todo: Todo, userId):
    response = await create_todo(todo.dict(), userId)
    if response:
        return response
    raise HTTPException(400, "Something went wrong")

# UPDATE A TASK (STATUS ONLY FOR NOW)
async def update_todo(id: PyObjectId, todo: UpdateTodoModel, userId: PyObjectId):
    if todo.subject != None:
        await todoCollection.update_one({"id": id}, {"$set": {"subject": todo.subject}})
    if todo.description != None:
        await todoCollection.update_one({"id": id}, {"$set": {"description": todo.description}})
    if todo.deadline != None:
        await todoCollection.update_one({"id": id}, {"$set": {"deadline": todo.deadline}})
    if todo.status != None:
        await todoCollection.update_one({"id": id}, {"$set": {"status": todo.status}})
    document = await todoCollection.find_one({"id": id, "owner_id": userId})
    return document

@app.put("/api/{userId}/todo/{id}", response_model=Todo)
async def put_todo(id: PyObjectId, todo: UpdateTodoModel, userId: PyObjectId):
    response = await update_todo(id, todo, userId)
    if response:
        return response
    raise HTTPException(404, f"There is no todo with the id {id}")

# DELETE A TASK
async def remove_todo(id: PyObjectId, userId: PyObjectId):
    await todoCollection.delete_one({"id": id, "owner_id": userId})
    return True

@app.delete("/api/{userId}/todo/{id}")
async def delete_todo(id: PyObjectId, userId: PyObjectId):
    response = await remove_todo(id, userId)
    if response:
        return "Successfully deleted todo"
    raise HTTPException(404, f"There is no todo with the id {id}")

# EVENT II
# GET ONE EVENT
async def fetch_one_event(id, userId):
    document = await eventCollection.find_one({"id": id, "owner_id": userId})
    return document

@app.get("/api/{userId}/event/{id}", response_model=Event)
async def get_event_by_id(id: PyObjectId, userId: PyObjectId):
    response = await fetch_one_event(id, userId)
    if response:
        return response
    raise HTTPException(404, f"There is no event with the id {id}")

# GET ALL EVENTS
async def fetch_all_events(userId):
    events = []
    cursor = eventCollection.find({})
    async for document in cursor:
        if document["owner_id"] == userId:
            events.append(Event(**document))
    return events

@app.get("/api/{userId}/events")
async def get_events(userId: PyObjectId):
    response = await fetch_all_events(userId)
    return response

# CREATE AN EVENT
async def create_event(event, userId):
    document = event
    document["owner_id"] = userId
    result = await eventCollection.insert_one(document)
    return document

@app.post("/api/{userId}/event", response_model=Event)
async def post_event(event: Event, userId: PyObjectId):
    response = await create_event(event.dict(), userId)
    if response:
        return response
    raise HTTPException(400, "Something went wrong")

# UPDATE AN EVENT
async def update_event(id: PyObjectId, event: UpdateEventModel, userId: PyObjectId):
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
    document = await eventCollection.find_one({"id": id, "owner_id": userId})
    return document

@app.put("/api/{userId}/event/{id}", response_model=Event)
async def put_event(id: PyObjectId, event: UpdateEventModel, userId: PyObjectId):
    response = await update_event(id, event, userId)
    if response:
        return response
    raise HTTPException(404, f"There is no event with the id {id}")

# DELETE A EVENT
async def remove_event(id: PyObjectId, userId: PyObjectId):
    await eventCollection.delete_one({"id": id, "owner_id": userId})
    return True

@app.delete("/api/{userId}/event/{id}")
async def delete_event(id: PyObjectId, userId: PyObjectId):
    response = await remove_event(id, userId)
    if response:
        return "Successfully deleted event"
    raise HTTPException(404, f"There is no event with the id {id}")

# Note II
# GET ONE Note
async def fetch_one_note(id, userId):
    document = await noteCollection.find_one({"id": id, "owner_id": userId})
    return document

@app.get("/api/{userId}/note/{id}", response_model=Todo)
async def get_note_by_id(id: PyObjectId, userId: PyObjectId):
    response = await fetch_one_note(id, userId)
    if response:
        return response
    raise HTTPException(404, f"There is no note with the id {id}")

# GET ALL notes
async def fetch_all_notes(userId):
    notes = []
    cursor = noteCollection.find({})
    async for document in cursor:
        if document["owner_id"] == userId:
            notes.append(Note(**document))
    return notes

@app.get("/api/{userId}/notes")
async def get_note(userId: PyObjectId):
    response = await fetch_all_notes(userId)
    return response

# CREATE A Note
async def create_note(note, userId):
    document = note
    document["owner_id"] = userId
    result = await noteCollection.insert_one(document)
    return document

@app.post("/api/{userId}/note", response_model=Note)
async def post_note(note: Note, userId: PyObjectId):
    response = await create_note(note.dict(), userId)
    if response:
        return response
    raise HTTPException(400, "Something went wrong")

# UPDATE A Note
async def update_note(id: PyObjectId, note: UpdateNoteModel, userId: PyObjectId):
    if note.note != None:
        await noteCollection.update_one({"id": id}, {"$set": {"note": note.note}})
    if note.tags != None:
        await noteCollection.update_one({"id": id}, {"$set": {"tags": note.tags}})
    if note.lastUpdated != None:
        await noteCollection.update_one({"id": id}, {"$set": {"lastUpdated": note.lastUpdated}})
    if note.active != None:
        await noteCollection.update_one({"id": id}, {"$set": {"active": note.active}})
    document = await noteCollection.find_one({"id": id, "owner_id": userId})
    return document

@app.put("/api/{userId}/note/{id}", response_model=Note)
async def put_note(id: PyObjectId, note: UpdateNoteModel, userId: PyObjectId):
    response = await update_note(id, note, userId)
    if response:
        return response
    raise HTTPException(404, f"There is no note with the id {id}")

# DELETE A Note
async def remove_note(id: PyObjectId, userId: PyObjectId):
    await noteCollection.delete_one({"id": id, "owner_id": userId})
    return True

@app.delete("/api/{userId}/note/{id}")
async def delete_note(id: PyObjectId, userId: PyObjectId):
    response = await remove_note(id, userId)
    if response:
        return "Successfully deleted note"
    raise HTTPException(404, f"There is no note with the id {id}")

# # TASK MANAGER
# # GET ONE TASK
# async def fetch_one_todo(id, current_user):
#     document = await todoCollection.find_one({"id": id, "owner_id": current_user["id"]})
#     return document

# @app.get("/api/todo/{id}", response_model=Todo)
# async def get_todo_by_id(id: PyObjectId, current_user: User = Depends(get_current_user)):
#     response = await fetch_one_todo(id, current_user)
#     if response:
#         return response
#     raise HTTPException(404, f"There is no todo with the id {id}")

# # GET ALL TASKS
# async def fetch_all_todos(current_user):
#     todos = []
#     cursor = todoCollection.find({})
#     async for document in cursor:
#         if document["owner_id"] == current_user["id"]:
#             todos.append(Todo(**document))
#     return todos

# @app.get("/api/todos")
# async def get_todo(current_user: User = Depends(get_current_user)):
#     response = await fetch_all_todos(current_user)
#     return response

# # CREATE A TASK
# async def create_todo(todo, current_user):
#     document = todo
#     document["owner_id"] = current_user["id"]
#     result = await todoCollection.insert_one(document)
#     return document

# @app.post("/api/todo", response_model=Todo)
# async def post_todo(todo: Todo, current_user: User = Depends(get_current_user)):
#     response = await create_todo(todo.dict(), current_user)
#     if response:
#         return response
#     raise HTTPException(400, "Something went wrong")

# # UPDATE A TASK (STATUS ONLY FOR NOW)
# async def update_todo(id: PyObjectId, todo: UpdateTodoModel, current_user: User):
#     if todo.subject != None:
#         await todoCollection.update_one({"id": id}, {"$set": {"subject": todo.subject}})
#     if todo.description != None:
#         await todoCollection.update_one({"id": id}, {"$set": {"description": todo.description}})
#     if todo.deadline != None:
#         await todoCollection.update_one({"id": id}, {"$set": {"deadline": todo.deadline}})
#     if todo.status != None:
#         await todoCollection.update_one({"id": id}, {"$set": {"status": todo.status}})
#     document = await todoCollection.find_one({"id": id, "owner_id": current_user["id"]})
#     return document

# @app.put("/api/todo/{id}", response_model=Todo)
# async def put_todo(id: PyObjectId, todo: UpdateTodoModel, current_user: User = Depends(get_current_user)):
#     response = await update_todo(id, todo, current_user)
#     if response:
#         return response
#     raise HTTPException(404, f"There is no todo with the id {id}")

# # DELETE A TASK
# async def remove_todo(id: PyObjectId, current_user: User):
#     await todoCollection.delete_one({"id": id, "owner_id": current_user["id"]})
#     return True

# @app.delete("/api/todo/{id}")
# async def delete_todo(id: PyObjectId, current_user: User = Depends(get_current_user)):
#     response = await remove_todo(id, current_user)
#     if response:
#         return "Successfully deleted todo"
#     raise HTTPException(404, f"There is no todo with the id {id}")

# # EVENT
# # GET ONE EVENT
# async def fetch_one_event(id, current_user):
#     document = await eventCollection.find_one({"id": id, "owner_id": current_user.id})
#     return document

# @app.get("/api/event/{id}", response_model=Event)
# async def get_event_by_id(id: PyObjectId, current_user: User = Depends(get_current_user)):
#     response = await fetch_one_event(id, current_user)
#     if response:
#         return response
#     raise HTTPException(404, f"There is no event with the id {id}")

# # GET ALL EVENTS
# async def fetch_all_events(current_user):
#     events = []
#     cursor = eventCollection.find({})
#     async for document in cursor:
#         if document["owner_id"] == current_user["id"]:
#             events.append(Event(**document))
#     return events

# @app.get("/api/events")
# async def get_events(current_user: User = Depends(get_current_user)):
#     response = await fetch_all_events(current_user)
#     return response

# # CREATE AN EVENT
# async def create_event(event, current_user):
#     document = event
#     document["owner_id"] = current_user["id"]
#     result = await eventCollection.insert_one(document)
#     return document

# @app.post("/api/event", response_model=Event)
# async def post_event(event: Event, current_user: User = Depends(get_current_user)):
#     response = await create_event(event.dict(), current_user)
#     if response:
#         return response
#     raise HTTPException(400, "Something went wrong")

# # UPDATE AN EVENT
# async def update_event(id: PyObjectId, event: UpdateEventModel, current_user: User):
#     if event.name != None:
#         await eventCollection.update_one({"id": id}, {"$set": {"name": event.name}})
#     if event.place != None:
#         await eventCollection.update_one({"id": id}, {"$set": {"place": event.place}})
#     if event.start != None:
#         await eventCollection.update_one({"id": id}, {"$set": {"start": event.start}})
#     if event.end != None:
#         await eventCollection.update_one({"id": id}, {"$set": {"end": event.end}})
#     if event.color != None:
#         await eventCollection.update_one({"id": id}, {"$set": {"color": event.color}})
#     if event.days != None:
#         await eventCollection.update_one({"id": id}, {"$set": {"days": event.days}})
#     document = await eventCollection.find_one({"id": id, "owner_id": current_user["id"]})
#     return document

# @app.put("/api/event/{id}", response_model=Event)
# async def put_event(id: PyObjectId, event: UpdateEventModel, current_user: User = Depends(get_current_user)):
#     response = await update_event(id, event, current_user)
#     if response:
#         return response
#     raise HTTPException(404, f"There is no event with the id {id}")

# # DELETE A EVENT
# async def remove_event(id: PyObjectId, current_user: User):
#     await eventCollection.delete_one({"id": id, "owner_id": current_user["id"]})
#     return True

# @app.delete("/api/event/{id}")
# async def delete_event(id: PyObjectId, current_user: User = Depends(get_current_user)):
#     response = await remove_event(id, current_user)
#     if response:
#         return "Successfully deleted event"
#     raise HTTPException(404, f"There is no event with the id {id}")

# # Note
# # GET ONE Note
# async def fetch_one_note(id, current_user):
#     document = await noteCollection.find_one({"id": id, "owner_id": current_user["id"]})
#     return document

# @app.get("/api/note/{id}", response_model=Todo)
# async def get_note_by_id(id: PyObjectId, current_user: User = Depends(get_current_user)):
#     response = await fetch_one_note(id, current_user)
#     if response:
#         return response
#     raise HTTPException(404, f"There is no note with the id {id}")

# # GET ALL notes
# async def fetch_all_notes(current_user):
#     notes = []
#     cursor = noteCollection.find({})
#     async for document in cursor:
#         if document["owner_id"] == current_user["id"]:
#             notes.append(Note(**document))
#     return notes

# @app.get("/api/{userId}/notes")
# async def get_note(current_user: User = Depends(get_current_user)):
#     response = await fetch_all_notes(current_user)
#     return response

# # CREATE A Note
# async def create_note(note):
#     document = note
#     document["owner_id"] = create_user["id"]
#     result = await noteCollection.insert_one(document)
#     return document

# @app.post("/api/note", response_model=Note)
# async def post_note(note: Note, current_user: User = Depends(get_current_user)):
#     response = await create_note(note.dict(), current_user)
#     if response:
#         return response
#     raise HTTPException(400, "Something went wrong")

# # UPDATE A Note
# async def update_note(id: PyObjectId, note: UpdateNoteModel, current_user: User):
#     if note.note != None:
#         await noteCollection.update_one({"id": id}, {"$set": {"note": note.note}})
#     if note.tags != None:
#         await noteCollection.update_one({"id": id}, {"$set": {"tags": note.tags}})
#     if note.lastUpdated != None:
#         await noteCollection.update_one({"id": id}, {"$set": {"lastUpdated": note.lastUpdated}})
#     if note.active != None:
#         await noteCollection.update_one({"id": id}, {"$set": {"active": note.active}})
#     document = await noteCollection.find_one({"id": id, "owner_id": current_user["id"]})
#     return document

# @app.put("/api/note/{id}", response_model=Note)
# async def put_note(id: PyObjectId, note: UpdateNoteModel, current_user: User = Depends(get_current_user)):
#     response = await update_note(id, note, current_user)
#     if response:
#         return response
#     raise HTTPException(404, f"There is no note with the id {id}")

# # DELETE A Note
# async def remove_note(id: PyObjectId, current_user: User):
#     await noteCollection.delete_one({"id": id, "owner_id": current_user["id"]})
#     return True