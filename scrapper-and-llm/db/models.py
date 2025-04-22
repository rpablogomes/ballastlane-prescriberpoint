from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class Disease(Base):
    __tablename__ = 'diseases'

    id = Column(Integer, primary_key=True)
    code = Column(String, nullable=True)
    name = Column(String, nullable=False)
    synonym = Column(String, nullable=True)

DATABASE_URL = "postgresql://username:password@localhost/prescriberpoint"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

def create_tables():
    Base.metadata.create_all(engine)
