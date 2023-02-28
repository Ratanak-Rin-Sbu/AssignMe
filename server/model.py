from bson import ObjectId
from pydantic import BaseModel, Field
from PyObjectId import PyObjectId
from typing import Optional

class Todo(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="id")
    subject: str
    description: str
    deadline: str
    status: bool

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "subject": "DS",
                "description": "Binary Tree",
                "deadline": "03/03/2023",
                "status": False,
            }
        }

class UpdateTodoModel(BaseModel):
    subject: Optional[str]
    description: Optional[str]
    deadline: Optional[str]
    status: Optional[bool]

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "subject": "DS",
                "description": "Binary Tree",
                "deadline": "03/03/2023",
                "status": False,
            }
        }

class Event(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="id")
    name: str
    place: str
    time: str
    days: list

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "CSE 310",
                "place": "B108",
                "time": "10:30-11:50",
                "days": ["Monday", "Tuesday"],
            }
        }

class UpdateEventModel(BaseModel):
    name: Optional[str]
    place: Optional[str]
    time: Optional[str]
    days: Optional[list]

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "CSE 310",
                "place": "B108",
                "time": "10:30-11:50",
                "days": ["Monday", "Tuesday"],
            }
        }