from pydantic import BaseModel

class Todo(BaseModel):
    subject: str
    description: str
    deadline: str
    status: bool