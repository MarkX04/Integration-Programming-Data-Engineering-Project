import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = f"mysql+mysqlconnector://{os.getenv('MYSQL_USER')}:" \
                              f"{os.getenv('MYSQL_PASSWORD')}@" \
                              f"{os.getenv('MYSQL_HOST')}:{os.getenv('MYSQL_PORT')}/" \
                              f"{os.getenv('MYSQL_DATABASE')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Disable track modifications to save memory
