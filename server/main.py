import motor.motor_asyncio
from fastapi import FastAPI, HTTPException, Depends, Request, status
from model import Todo, UpdateTodoModel, Event, UpdateEventModel, Note, UpdateNoteModel, User, Login, Token, TokenData
from fastapi import Body
from PyObjectId import PyObjectId
from fastapi.middleware.cors import CORSMiddleware

# authentication
from typing import Optional
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from hashing import Hash
from jwttoken import create_access_token
from oauth import get_current_user
from fastapi.security import OAuth2PasswordRequestForm

app = FastAPI()

# DATABASE SETUP
client = motor.motor_asyncio.AsyncIOMotorClient('mongodb+srv://jassonrin:stfuimissHER0730@cluster0.4wfy1nc.mongodb.net/?retryWrites=true&w=majority')
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
userDB = client.Users
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
def read_root(current_user:User = Depends(get_current_user)):
	return {"data":"Hello World"}

#  USER AUTHENTICATION
@app.post("/api/register")
def create_user(request:User):
	hashed_pass = Hash.bcrypt(request.password)
	user_object = dict(request)
	user_object["password"] = hashed_pass
	user_id = userCollection.insert(user_object)
	# print(user)
	return {"res":"created"}

@app.post("/api/login")
def login(request:OAuth2PasswordRequestForm = Depends()):
	user = userCollection.find_one({"username": request.username})
	if not user:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail = f'No user found with this {request.username} username')
	if not Hash.verify(user["password"], request.password):
		raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = f'Wrong Username or password')
	access_token = create_access_token(data = { "sub": user["username"] })
	return {"access_token": access_token, "token_type": "bearer" }

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