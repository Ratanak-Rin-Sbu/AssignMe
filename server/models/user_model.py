from bson import ObjectId
from pydantic import BaseModel, Field, EmailStr
from PyObjectId import PyObjectId
from beanie import Indexed, Document
from datetime import datetime

class User(BaseModel):
  id: PyObjectId = Field(default_factory=PyObjectId, alias="id")
  username: Indexed(str, unique=True)
  email: Indexed(EmailStr, unique=True)
  password: str
  picture: str

  class Config:
    allow_population_by_field_name = True
    arbitrary_types_allowed = True
    json_encoders = {ObjectId: str}
    schema_extra = {
        "example": {
            "username": "Jasson Rin",
            "email": "user@example.com",
            "password": "123",
            "picture": "thisIsThePicturePathLink"
        }
    }

  def __repr__(self) -> str:
    return f"<User {self.email}>"

  def __str__(self) -> str:
    return self.email

  def __hash__(self) -> int:
    return hash(self.email)

  def __eq__(self, other: object) -> bool:
    if isinstance(other, User):
        return self.email == other.email
    return False
  
  @property
  def create(self) -> datetime:
    return self.id.generation_time
  
  @classmethod
  async def by_email(self, email: str) -> "User":
    return await self.find_one(self.email == email)
  
class TokenSchema(BaseModel):
  access_token: str
  refresh_token: str

class TokenPayload(BaseModel):
  sub: PyObjectId = Field(default_factory=PyObjectId, alias="id")
  exp: int = None

  class Config:
    allow_population_by_field_name = True
    arbitrary_types_allowed = True
    json_encoders = {ObjectId: str}