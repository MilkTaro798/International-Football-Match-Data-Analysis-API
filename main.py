from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import Dict
from database import DataBase
import json
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional




app = FastAPI()


app.db = DataBase()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)


@app.get("/all-matches")
async def all_matches(
    page: int = 1, 
    latest_matches: Optional[bool] = True, 
    team_name: Optional[str] = None, 
    year: Optional[int] = None):
    return app.db.get_all_matches(page=page, latest_matches=latest_matches, team_name=team_name, year=year)

@app.get("/team-matches-stats")
async def team_matches_stats(
    team1: str = Query(..., description="Name of the first team"), 
    team2: str = Query(..., description="Name of the second team"), 
    year: Optional[int] = None, 
    tournament_type: Optional[str] = None, 
    page: int = 1, 
    latest_matches: Optional[bool] = True
):
    return app.db.get_team_matches_stats(
        team1=team1, 
        team2=team2, 
        year=year, 
        tournament_type=tournament_type, 
        page=page, 
        latest_matches=latest_matches
    )


