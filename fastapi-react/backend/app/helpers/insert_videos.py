from sqlalchemy.orm import Session
from models import Video  # Import your User model
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

def create_video(db: Session,video: Video):
    try:
        db_video = video
        db.add(db_video)
        db.commit()
        db.refresh(db_video)
        print(f"video '{video.videoname}' inserted into the database.")
    except Exception as e:
        print(f"An error ocurred")

def main():
    db = DatabaseSession()
    db.init()

    # Insert users interactively
    while True:
        method = input("will you use schema? (yes or no or 'exit' to finish) ")
        if method.lower() == 'exit':
            break

        if method == 'yes':
            video = input("enter video: ")
            video = video.split("','")
            video[0]=video[0][1:]   # tirar a plica do inicio da string
            last2parameters=video[-1].split("',") # ler o ultimo parametro
            video.pop()
            video+= last2parameters
            print(video)
            
            video_class = Video(videopath=video[0],videoname=video[1],description=video[2],muscletargets=video[3],releasedate=video[4],restricted=int(video[5]))
        elif method == 'no':
            videopath=input("videopath? ")
            videoname=input("videoname? ")
            description=input("description? ")
            muscletargets=input("muscletargets? ")
            releasedate=input("releasedate? ")
            restricted=input("restricted? (1 or 0) ")
            while restricted!='1' and restricted!= '0':
                print("please enter '1' for True or '0' for False ")
                restricted=input("restricted? (1 or 0) ")
            video_class = Video(videopath=videopath,videoname=videoname,description=description,muscletargets=muscletargets,releasedate=releasedate,restricted=int(restricted))
        else:
            print("please enter 'yes' or 'no'")
            continue
        create_video(db, video_class)

    db.close()

if __name__ == "__main__":
    main()
