import motor.motor_asyncio
from model import Todo

client = motor.motor_asyncio.AsyncIOMotorClient('mongodb+srv://jassonrin:stfuimissHER0730@cluster0.4wfy1nc.mongodb.net/?retryWrites=true&w=majority')
database = client.TodoList
collection = database.todo

async def fetch_one_todo(subject):
    document = await collection.find_one({"subject": subject})
    return document

async def fetch_all_todos():
    todos = []
    cursor = collection.find({})
    async for document in cursor:
        todos.append(Todo(**document))
    return todos

async def create_todo(todo):
    document = todo
    result = await collection.insert_one(document)
    return document


async def update_todo(subject, desc, deadline, status):
    await collection.update_one({"subject": subject}, {"$set": {"description": desc}})
    await collection.update_one({"subject": subject}, {"$set": {"deadline": deadline}})
    await collection.update_one({"subject": subject}, {"$set": {"status": status}}) 
    document = await collection.find_one({"subject": subject})
    return document

async def remove_todo(subject):
    await collection.delete_one({"subject": subject})
    return True