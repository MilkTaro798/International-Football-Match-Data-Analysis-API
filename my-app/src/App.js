import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Matches from './components/Matches';
import TeamStatsForm from './components/TeamStatsForm';
import TwoTeamStat from './components/TwoTeamStat';



function App() {
  const [showTeamStatsInput, setShowTeamStatsInput] = useState(false);


  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>International football results from 1872 to 2023</h1>
          <p>
            Explore a comprehensive dataset of international football results.
            This tool provides football enthusiasts, sports analysts, and researchers
            with programmatic access to historical football data for analysis and insights.
          </p>
          <nav>
            <Link to="/matches"><button>All Matches</button></Link>
            <button onClick={() => setShowTeamStatsInput(true)}>The historical statistics of the battle between the two teams</button>
          </nav>
          {showTeamStatsInput && <TeamStatsForm />}
          <Routes>
            <Route path="/matches" element={<Matches />} />
            <Route path="/two-team-stat" element={<TwoTeamStat />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
