# International Football Match Data Analysis API

Name: Yutong Sun
Email: milktaro798@gmail.com

## Project Overview
This project constructs an API using Python to allow users to explore and analyze a rich dataset of international football results. The tool assists football enthusiasts, sports analysts, and researchers in obtaining quick, programmatic access to historical football data.

## API Features
1. Retrieve all matches: Returns a paginated list of all recorded international football matches.
2. Retrieve matches for a specific team: Given a team name, returns all matches involving that team.
3. Retrieve matches between two teams: Given two team names, returns all historical match data between them.
4. Retrieve matches for a specific year: Given a year, returns all matches that occurred in that year.
5. Calculate a team's win-loss ratio: Given a team name, returns the team's historical win-loss ratio.
6. Find the most frequent opponent: Given a team name, finds the team against which they have played the most matches.

The project utilizes FastAPI or Flask for API development.

## Project Setup

### Starting the Project
To get the project up and running, follow these steps:

1. **Start the Backend**: Activate the backend by entering the following command in the terminal:
```bash
hypercorn main:app --reload
```
2. **Start the Frontend**: To start the frontend, open a new terminal within the project directory and run:
```bash
cd my-app | npm start
```

## Data Sources
The project data is sourced from the following locations:
- Kaggle Dataset: [International Football Results from 1872 to 2017](https://www.kaggle.com/datasets/martj42/international-football-results-from-1872-to-2017/data)
- Google Drive: [Download from Google Drive](https://drive.google.com/file/d/1SSqyJFeKe1mjGSo4IcHrphe_FyiVXynI/view?usp=drive_link)