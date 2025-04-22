
from fastapi import FastAPI
from scrap.dailymed import dailymedscrap

app = FastAPI()

@app.get("/{drugName}")
def read_root(drugName: str):
    """"endpoint that return the value of the medicine"""
    
    ##I set Dupixent based on requiment. However, the intention is to get the medicine name from the user.

    response = dailymedscrap("Dupixent")

    for indications in response:
        
    return response