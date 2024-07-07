import pandas as pd
import requests
from io import StringIO

class DataBase():
    def __init__(self):
        self.df = self.load_data()

    def load_data(self):
        url = 'https://drive.google.com/file/d/1SSqyJFeKe1mjGSo4IcHrphe_FyiVXynI/view?usp=drive_link'
        file_id = url.split('/')[-2]
        dwn_url='https://drive.google.com/uc?export=download&id=' + file_id
        url2 = requests.get(dwn_url).text
        csv_raw = StringIO(url2)
        return pd.read_csv(csv_raw)
        
    def get_all_matches(self, page=1, page_size=10, latest_matches=True, team_name=None, year=None):
        matches = self.df
        if year:
            matches = matches[matches['date'].str.startswith(str(year))]
        
        # Sorting the dataframe based on the date
        sorted_df = matches.sort_values(by='date', ascending=not latest_matches)

        if team_name:
            # Filter matches where the team is either the home team or the away team
            team_matches = sorted_df[(sorted_df['home_team'] == team_name) | (sorted_df['away_team'] == team_name)]
            stats = self.calculate_team_stats(team_matches, team_name)
            sorted_df = team_matches
        
        sorted_df = sorted_df.reset_index()
        total_count = len(sorted_df)  # Update the total count based on filtered data

        # Implementing pagination
        start = (page - 1) * page_size
        end = start + page_size
        paginated_data = sorted_df.iloc[start:end].copy()

        paginated_data['index'] = paginated_data.index

        if team_name:
            return {'data': paginated_data.to_dict(orient='records'), 'total_count': total_count, 'stats': stats}
        
        return {'data': paginated_data.to_dict(orient='records'), 'total_count': total_count}

    def calculate_team_stats(self, df, team_name):
        wins = len(df[(df['home_team'] == team_name) & (df['home_score'] > df['away_score']) | 
                      (df['away_team'] == team_name) & (df['away_score'] > df['home_score'])])
        draws = len(df[df['home_score'] == df['away_score']])
        losses = len(df) - wins - draws

        win_rate = wins / len(df) if len(df) > 0 else 0
        draw_rate = draws / len(df) if len(df) > 0 else 0
        loss_rate = losses / len(df) if len(df) > 0 else 0

        home_teams = df['home_team']
        away_teams = df['away_team']
        opponent_counts = pd.concat([home_teams, away_teams]).value_counts()
        opponent_counts = opponent_counts[opponent_counts.index != team_name]
        most_played_team = opponent_counts.idxmax() if not opponent_counts.empty else None


        return {
            'win_rate': win_rate,
            'draw_rate': draw_rate,
            'loss_rate': loss_rate,
            'most_played_team': most_played_team
        }

    def get_team_matches_stats(self, team1, team2, year=None, tournament_type=None, page=1, page_size=10, latest_matches=True):
        # Filter matches where either of the teams is playing
        matches = self.df[((self.df['home_team'] == team1) & (self.df['away_team'] == team2)) |
                          ((self.df['home_team'] == team2) & (self.df['away_team'] == team1))]

        # Getting unique tournament types from the filtered matches
        tournament_types = matches['tournament'].unique().tolist()
        
        # Filter by year if specified
        if year:
            matches = matches[matches['date'].str.startswith(str(year))]

        

        # Filter by tournament if specified
        if tournament_type:
            matches = matches[matches['tournament'] == tournament_type]

        # Sorting matches based on date
        matches = matches.sort_values(by='date', ascending=not latest_matches)

        matches = matches.reset_index()

        

        # Analyzing data
        total_matches = len(matches)
        wins_team1 = len(matches[((matches['home_team'] == team1) & (matches['home_score'] > matches['away_score'])) |
                                 ((matches['away_team'] == team1) & (matches['away_score'] > matches['home_score']))])
        wins_team2 = len(matches[((matches['home_team'] == team2) & (matches['home_score'] > matches['away_score'])) |
                                 ((matches['away_team'] == team2) & (matches['away_score'] > matches['home_score']))])
        draws = len(matches[matches['home_score'] == matches['away_score']])

        win_rate_team1 = wins_team1 / total_matches if total_matches > 0 else 0
        win_rate_team2 = wins_team2 / total_matches if total_matches > 0 else 0
        draw_rate = draws / total_matches if total_matches > 0 else 0

        home_goals_team1 = matches[(matches['home_team'] == team1) & ~matches['neutral']]['home_score'].mean()
        away_goals_team1 = matches[(matches['away_team'] == team1) & ~matches['neutral']]['away_score'].mean()
        home_goals_team2 = matches[(matches['home_team'] == team2) & ~matches['neutral']]['home_score'].mean()
        away_goals_team2 = matches[(matches['away_team'] == team2) & ~matches['neutral']]['away_score'].mean()

        
        # Implementing pagination
        start = (page - 1) * page_size
        end = start + page_size
        paginated_matches = matches.iloc[start:end].copy()
        paginated_matches['index'] = paginated_matches.index

        paginated_match_data = paginated_matches.to_dict(orient='records')



        # Preparing the result
        stats = {
            'total_matches': total_matches,
            'win_rate_team1': win_rate_team1,
            'win_rate_team2': win_rate_team2,
            'draw_rate': draw_rate,
            'average_home_goals_team1': home_goals_team1,
            'average_away_goals_team1': away_goals_team1,
            'average_home_goals_team2': home_goals_team2,
            'average_away_goals_team2': away_goals_team2
        }

        return {'matches': paginated_match_data, 'statistics': stats, 'tournament_types': tournament_types}
