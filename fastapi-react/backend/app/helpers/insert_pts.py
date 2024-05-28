from sqlalchemy.orm import Session
from models import PersonalTrainer  # Import your User model
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from os import environ

URL_DATABASE = environ.get("URL_DATABASE", "postgresql://postgres:postgres@localhost:5432/peci")
Base = declarative_base()

class DatabaseSession():
    def __init__(self):
        self.session = None
        self.engine = None

    def __getattr__(self, name):
        return getattr(self.session, name)

    def init(self):
        self.engine = create_engine(URL_DATABASE)
        Base.metadata.create_all(bind=self.engine)
        self.session = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)()

def create_pt(db: Session, username: str, password: str):
    try:
        db_pt = PersonalTrainer(username=username, password=password,token=None)
        db.add(db_pt)
        db.commit()
        db.refresh(db_pt)
        print(f"Personal trainer '{username}' inserted into the database.")
    except Exception as e:
        print(f"An error ocurred: {e}")

    return db_pt

def main():
    
    db = DatabaseSession()
    db.init()
    
    # Insert Personal Trainers interactively
    while True:
        username = input("Enter username (or type 'exit' to finish): ")
        if username.lower() == 'exit':
            break
        password = input("Enter password: ")
        
        create_pt(db, username=username, password=password)

    db.close()

if __name__ == "__main__":
    main()
