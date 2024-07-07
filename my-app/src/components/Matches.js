import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Matches() {
    const [matches, setMatches] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [inputPage, setInputPage] = useState(1);
    const [latestMatches, setLatestMatches] = useState(true);
    const [teamName, setTeamName] = useState(''); 
    const [year, setYear] = useState(0); 
    const [teamStats, setTeamStats] = useState(null); 

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/all-matches`, { 
            params: { 
                page: currentPage, 
                latest_matches: latestMatches,
                team_name: teamName,
                year: year
            } 
        })
            .then(response => {
                setMatches(response.data.data);
                setTotalPages(Math.ceil(response.data.total_count / 10)); 
                setTeamStats(response.data.stats);
            })
            .catch(error => console.error('Error fetching data: ', error));
    }, [currentPage, latestMatches, teamName, year]); 


    const getMatchColor = (homeScore, awayScore) => {
        if (homeScore > awayScore) return 'green';
        if (homeScore < awayScore) return 'red';
        return 'yellow';
    };

    const renderPagination = () => {
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 3 && i <= currentPage + 3)) {
                pages.push(
                    <button key={i} onClick={() => setCurrentPage(i)} disabled={currentPage === i}>
                        {i}
                    </button>
                );
            } else if (i === currentPage - 4 || i === currentPage + 4) {
                pages.push(<span key={i}>...</span>);
            }
        }
        return pages;
    };

    const handlePageInputChange = e => {
        setInputPage(e.target.value);
    };

    const goToInputPage = () => {
        const page = Math.max(1, Math.min(totalPages, Number(inputPage)));
        setCurrentPage(page);
    };

    const handleTeamNameChange = (e) => {
      setTeamName(e.target.value);
    };

    const handleYearChange = e => {
        setYear(e.target.value);
    };

    return (
        <div>
            <h1>{teamName ? `Matches for ${teamName}` : 'All Matches'}</h1>
            <input 
                type="text" 
                placeholder="Search by team name" 
                value={teamName}
                onChange={handleTeamNameChange} 
            />
            <input 
                type="number"
                placeholder="Year"
                value={year}
                onChange={handleYearChange}
            />
            <button onClick={() => setLatestMatches(!latestMatches)}>
                {latestMatches ? 'Show Earliest Matches' : 'Show Latest Matches'}
            </button>
            {teamStats && (
                <div>
                    <h3>Team Stats for {teamName}</h3>
                    <p>Win Rate: {teamStats.win_rate}</p>
                    <p>Draw Rate: {teamStats.draw_rate}</p>
                    <p>Loss Rate: {teamStats.loss_rate}</p>
                    <p>Most Played Team: {teamStats.most_played_team}</p>
                </div>
            )}
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th>Home Team - Score</th>
                        <th>Away Team - Score</th>
                        <th>Date</th>
                        <th>Tournament</th>
                        <th>City - Country</th>
                        <th>Neutral</th>
                    </tr>
                </thead>
                <tbody>
                    {matches.map(match => (
                        <tr key={match.index}>
                            <td style={{ color: getMatchColor(match.home_score, match.away_score), border: '1px solid black' }}>
                                {match.home_team} - {match.home_score}
                            </td>
                            <td style={{ color: getMatchColor(match.away_score, match.home_score), border: '1px solid black' }}>
                                {match.away_team} - {match.away_score}
                            </td>
                            <td style={{ border: '1px solid black' }}>{match.date}</td>
                            <td style={{ border: '1px solid black' }}>{match.tournament}</td>
                            <td style={{ border: '1px solid black' }}>{match.city} - {match.country}</td>
                            <td style={{ border: '1px solid black' }}>{match.neutral ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                    Previous
                </button>
                {renderPagination()}
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next
                </button>
                <input type="number" value={inputPage} onChange={handlePageInputChange} />
                <button onClick={goToInputPage}>Go to Page</button>
            </div>
        </div>
    );
}

export default Matches;
