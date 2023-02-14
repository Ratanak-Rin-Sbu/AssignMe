from fastapi import FastAPI, HTTPException

from model import Todo

from database import (
    fetch_one_todo,
    fetch_all_todos,
    create_todo,
    update_todo,
    remove_todo,
)

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# what is a middleware? 
# software that acts as a bridge between an operating system or database and applications, especially on a network.

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

@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.get("/api/todo")
async def get_todo():
    response = await fetch_all_todos()
    return response

@app.get("/api/todo/{subject}", response_model=Todo)
async def get_todo_by_subject(subject):
    response = await fetch_one_todo(subject)
    if response:
        return response
    raise HTTPException(404, f"There is no todo with the subject {subject}")

@app.post("/api/todo/", response_model=Todo)
async def post_todo(todo: Todo):
    response = await create_todo(todo.dict())
    if response:
        return response
    raise HTTPException(400, "Something went wrong")

@app.put("/api/todo/{subject}/", response_model=Todo)
async def put_todo(subject: str, desc: str, deadline: str, status: bool):
    response = await update_todo(subject, desc, deadline, status)
    if response:
        return response
    raise HTTPException(404, f"There is no todo with the subject {subject}")

@app.delete("/api/todo/{subject}")
async def delete_todo(subject):
    response = await remove_todo(subject)
    if response:
        return "Successfully deleted todo"
    raise HTTPException(404, f"There is no todo with the subject {subject}")