# DESCRIPTION:
# This file connects and configures the database
# and some other related things like orm (Object-relational mapping)

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

db = DatabaseSession()
