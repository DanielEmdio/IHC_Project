from sqlalchemy.orm import Session
from models import Subscription, User, PersonalTrainer  # Import your User model
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

# def create_sub_by_username(db: Session, user_username: str, pt_username: str):
#     try:
#         user_id = db.query(User.id).filter(User.username==user_username).scalar()
#         personal_trainer_id = db.query(PersonalTrainer.id).filter(PersonalTrainer.username==pt_username).scalar()

#         if user_id is not None and personal_trainer_id is not None:
#             db_sub = Subscription(user_id=user_id,personal_trainer_id=personal_trainer_id)
#             db.add(db_sub)
#             db.commit()
#             db.refresh(db_sub)
#             print(f"Sub between user_username '{user_username}' and pt_username '{pt_username}' inserted into the database.")
#         else:
#             print(f"Invalid username(s). Failed to make subscription")
#     except Exception as e:
#         print(f"An error ocurred: {e} (in create_sub_by_username)")

def create_sub(db: Session, user_identifier: str, pt_identifier: str, use_usernames):
    try:
        if use_usernames:
            print("using usernames...")
            user_id = db.query(User.id).filter(User.username==user_identifier).scalar()
            personal_trainer_id = db.query(PersonalTrainer.id).filter(PersonalTrainer.username==pt_identifier).scalar()
        else:
            print("using ids...")
            user_id = user_identifier
            personal_trainer_id = pt_identifier

        if user_id is not None and personal_trainer_id is not None:
            db_sub = Subscription(user_id=user_id,personal_trainer_id=personal_trainer_id)
            db.add(db_sub)
            db.commit()
            db.refresh(db_sub)
            print(f"Sub between user '{user_identifier}' and personal trainer '{pt_identifier}' inserted into the database.")
        else:
            print(f"Invalid indentifiers. -> Make sure they are both ids or both usernames <-.  Failed to make subscription")
            
    except Exception as e:
        print(f"An error ocurred: {e} ")        

def main():
    db = DatabaseSession()
    db.init()
    
    # Insert subs interactively
    while True:
        method = input("Will you use usernames or ids? Enter '0' for usernames, any other key for ids, or 'exit' to finish: ")
        if method.lower() == 'exit':
            break
        use_usernames = method == '0'   # use_usernames is boolean
        if use_usernames:
            user_identifier = input("Enter user username: ")
            pt_identifier = input("Enter personal trainer username: ")
        else:
            user_identifier = input("Enter user id: ")
            pt_identifier = input("Enter personal trainer id: ")

        create_sub(db, user_identifier, pt_identifier,use_usernames)
        print("\n")

    db.close()

if __name__ == "__main__":
    main()
