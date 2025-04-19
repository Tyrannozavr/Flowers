from pydantic import BaseModel, EmailStr


class UserRegistrationSchema(BaseModel):
    email: EmailStr
    password: str


class UserCredentials(BaseModel):
    username: str
    password: str
    email: EmailStr 