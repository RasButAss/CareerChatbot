from beanie import Document, Indexed

class User(Document):
    name: str
    email: Indexed(str, unique=True)
    picture : str

async def find_by_email(email : str):
    user = await User.find_one(User.email == email)
    return user