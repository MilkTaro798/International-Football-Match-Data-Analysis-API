import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TeamStatsForm() {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const navigate = useNavigate();

  const handleTeamStatsSearch = () => {
    if (!team1 || !team2) {
      alert("Please enter both team names.");
    } else {
      navigate(`/two-team-stat?team1=${team1}&team2=${team2}`);
    }
  };

  return (
    <div>
      <input type="text" placeholder="Team 1" value={team1} onChange={e => setTeam1(e.target.value)} />
      <input type="text" placeholder="Team 2" value={team2} onChange={e => setTeam2(e.target.value)} />
      <button onClick={handleTeamStatsSearch}>Search</button>
    </div>
  );
}

export default TeamStatsForm;
