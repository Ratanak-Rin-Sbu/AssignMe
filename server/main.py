import motor.motor_asyncio
from fastapi import FastAPI, HTTPException, Request
from model import Todo, UpdateTodoModel
from fastapi import Body
from PyObjectId import PyObjectId
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# DATABASE SETUP
client = motor.motor_asyncio.AsyncIOMotorClient('mongodb+srv://jassonrin:stfuimissHER0730@cluster0.4wfy1nc.mongodb.net/?retryWrites=true&w=majority')
database = client.TodoList
collection = database.todo

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
async def remove_todo(subject):
    await collection.delete_one({"subject": subject})
    return True

@app.delete("/api/todo/{id}")
async def delete_todo(id):
    response = await remove_todo(id)
    if response:
        return "Successfully deleted todo"
    raise HTTPException(404, f"There is no todo with the id {id}")