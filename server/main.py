import motor.motor_asyncio
from fastapi import FastAPI, HTTPException, Request
from model import Todo, UpdateTodoModel, Event, UpdateEventModel
from fastapi import Body
from PyObjectId import PyObjectId
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# DATABASE SETUP
client = motor.motor_asyncio.AsyncIOMotorClient('mongodb+srv://jassonrin:stfuimissHER0730@cluster0.4wfy1nc.mongodb.net/?retryWrites=true&w=majority')
# Todo DB
database = client.TodoList
collection = database.todo
# Event DB
database2 = client.EventList
collection2 = database2.event

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
async def read_root():
    return {"Hello": "World"}

# GET ONE TASK
async def fetch_one_todo(id):
    document = await collection.find_one({"id": id})
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
    cursor = collection.find({})
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
    result = await collection.insert_one(document)
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
        await collection.update_one({"id": id}, {"$set": {"subject": todo.subject}})
    if todo.description != None:
        await collection.update_one({"id": id}, {"$set": {"description": todo.description}})
    if todo.deadline != None:
        await collection.update_one({"id": id}, {"$set": {"deadline": todo.deadline}})
    if todo.status != None:
        await collection.update_one({"id": id}, {"$set": {"status": todo.status}})
    document = await collection.find_one({"id": id})
    return document

@app.put("/api/todo/{id}", response_model=Todo)
async def put_todo(id: PyObjectId, todo: UpdateTodoModel):
    response = await update_todo(id, todo)
    if response:
        return response
    raise HTTPException(404, f"There is no todo with the id {id}")

# DELETE A TASK
async def remove_todo(id: PyObjectId):
    await collection.delete_one({"id": id})
    return True

@app.delete("/api/todo/{id}")
async def delete_todo(id: PyObjectId):
    response = await remove_todo(id)
    if response:
        return "Successfully deleted todo"
    raise HTTPException(404, f"There is no todo with the id {id}")

# GET ONE EVENT
async def fetch_one_event(id):
    document = await collection2.find_one({"id": id})
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
    cursor = collection2.find({})
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
    result = await collection2.insert_one(document)
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
        await collection2.update_one({"id": id}, {"$set": {"name": event.name}})
    if event.place != None:
        await collection2.update_one({"id": id}, {"$set": {"place": event.place}})
    if event.start != None:
        await collection2.update_one({"id": id}, {"$set": {"start": event.start}})
    if event.end != None:
        await collection2.update_one({"id": id}, {"$set": {"end": event.end}})
    if event.color != None:
        await collection2.update_one({"id": id}, {"$set": {"color": event.color}})
    if event.days != None:
        await collection2.update_one({"id": id}, {"$set": {"days": event.days}})
    document = await collection2.find_one({"id": id})
    return document

@app.put("/api/event/{id}", response_model=Event)
async def put_event(id: PyObjectId, event: UpdateEventModel):
    response = await update_event(id, event)
    if response:
        return response
    raise HTTPException(404, f"There is no event with the id {id}")

# DELETE A EVENT
async def remove_event(id: PyObjectId):
    await collection2.delete_one({"id": id})
    return True

@app.delete("/api/event/{id}")
async def delete_event(id: PyObjectId):
    response = await remove_event(id)
    if response:
        return "Successfully deleted event"
    raise HTTPException(404, f"There is no event with the id {id}")