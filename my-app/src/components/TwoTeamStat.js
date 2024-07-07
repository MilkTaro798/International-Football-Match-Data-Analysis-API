import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function TwoTeamStat() {
    const [matches, setMatches] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [inputPage, setInputPage] = useState(1);
    const [latestMatches, setLatestMatches] = useState(true);
    const [year, setYear] = useState(0);
    const [tournamentType, setTournamentType] = useState('');
    const [tournamentTypes, setTournamentTypes] = useState([]);
    const [statistics, setStatistics] = useState({});

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const team1 = searchParams.get('team1');
    const team2 = searchParams.get('team2');

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/team-matches-stats`, { 
            params: { 
                team1: team1,
                team2: team2,
                year: year,
                tournament_type: tournamentType,
                page: currentPage, 
                latest_matches: latestMatches
            } 
        })
        .then(response => {
            console.log("API Response:", response.data);
            setMatches(response.data.matches);
            setStatistics(response.data.statistics);
            setTournamentTypes(response.data.tournament_types);
            setTotalPages(Math.ceil(response.data.statistics.total_matches / 10));
        })
        .catch(error => console.error('Error fetching data: ', error));
    }, [currentPage, latestMatches, year, tournamentType, team1, team2]); 


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

    const renderStatisticsBar = () => {
        let winRate1 = statistics.win_rate_team1 || 0;
        let winRate2 = statistics.win_rate_team2 || 0;
        let drawRate = statistics.draw_rate || 0;

        const totalRate = winRate1 + winRate2 + drawRate;
        if (totalRate !== 1) {
            drawRate = 1 - winRate1 - winRate2;
        }
        winRate1 = (winRate1 * 100).toFixed(2);
        winRate2 = (winRate2 * 100).toFixed(2);
        drawRate = (drawRate * 100).toFixed(2);

        return (
            <div style={{ display: 'flex', width: '100%', margin: '20px 0' }}>
                <div style={{ backgroundColor: 'green', width: `${winRate1}%` }}>{team1} {winRate1}%</div>
                <div style={{ backgroundColor: 'black', width: `${drawRate}%` }}>Draw {drawRate}%</div>
                <div style={{ backgroundColor: 'red', width: `${winRate2}%` }}>{team2} {winRate2}%</div>
            </div>
        );
    };
    return (
        <div>
            <h1>{`The historical statistics of the battle between ${team1} and ${team2}`}</h1>
            <button onClick={() => setLatestMatches(!latestMatches)}>
                {latestMatches ? 'Show Earliest Matches' : 'Show Latest Matches'}
            </button>
            <input 
                type="number" 
                placeholder="Year (1872-2023)" 
                value={year}
                onChange={e => setYear(e.target.value)} 
                min="1872" 
                max="2023"
            />
            <select value={tournamentType} onChange={e => setTournamentType(e.target.value)}>
                <option value="">All Tournaments</option>
                {tournamentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
            <div>
                <h2>Statistics</h2>
                <p>Total Matches: {statistics.total_matches}</p>
                {renderStatisticsBar()}
                <p>{team1} Average Home Goals: {statistics.average_home_goals_team1}</p>
                <p>{team1} Average Away Goals: {statistics.average_away_goals_team1}</p>
                <p>{team2} Average Home Goals: {statistics.average_home_goals_team2}</p>
                <p>{team2} Average Away Goals: {statistics.average_away_goals_team2}</p>
            </div>
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

export default TwoTeamStat;
