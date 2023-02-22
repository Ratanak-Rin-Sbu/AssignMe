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
    desc: Optional[str]
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