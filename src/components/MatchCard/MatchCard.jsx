import React, { useState } from 'react';
import './MatchCard.css';

const MatchCard = ({ match, onScoreChange, isEditable = false, stage = 'group' }) => {
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');

  const handleScoreSubmit = () => {
    if (homeScore !== '' && awayScore !== '' && onScoreChange) {
      onScoreChange(match.id, parseInt(homeScore), parseInt(awayScore));
      setHomeScore('');
      setAwayScore('');
    }
  };

  const handleScoreChange = (team, value) => {
    // Only allow numbers 0-20
    const numValue = value === '' ? '' : Math.max(0, Math.min(20, parseInt(value) || 0));
    
    if (team === 'home') {
      setHomeScore(numValue);
    } else {
      setAwayScore(numValue);
    }
  };

  const getStageColor = () => {
    switch(stage) {
      case 'roundOf32': return '#3b82f6';
      case 'roundOf16': return '#8b5cf6';
      case 'quarterFinals': return '#10b981';
      case 'semiFinals': return '#f59e0b';
      case 'thirdPlace': return '#ef4444';
      case 'final': return '#ec4899';
      default: return '#6b7280';
    }
  };

  const getStageName = () => {
    switch(stage) {
      case 'roundOf32': return 'Round of 32';
      case 'roundOf16': return 'Round of 16';
      case 'quarterFinals': return 'Quarter Finals';
      case 'semiFinals': return 'Semi Finals';
      case 'thirdPlace': return 'Third Place Match';
      case 'final': return 'Final';
      default: return 'Group Stage';
    }
  };

  const isThirdPlaceMatch = match.id === 103;
  const isFinal = match.id === 104;

  return (
    <div className={`match-card ${stage} ${match.played ? 'played' : 'upcoming'} ${isFinal ? 'final-match' : ''}`}>
      <div className="match-header" style={{ backgroundColor: getStageColor() }}>
        <div className="match-info">
          <span className="match-name">{match.name}</span>
          {!isFinal && !isThirdPlaceMatch && (
            <span className="match-stage">{getStageName()}</span>
          )}
          {isThirdPlaceMatch && (
            <span className="match-stage">Third Place Playoff</span>
          )}
          {isFinal && (
            <span className="match-stage">WORLD CUP FINAL</span>
          )}
        </div>
        {match.stadium && (
          <div className="match-stadium">
            <span className="stadium-icon">🏟️</span>
            {match.stadium}
          </div>
        )}
      </div>

      <div className="match-body">
        <div className="teams-container">
          {/* Home Team */}
          <div className={`team home-team ${match.winner?.id === match.home?.id ? 'winner' : ''}`}>
            <div className="team-flag">
              {match.home?.countryCode || '🏴'}
            </div>
            <div className="team-details">
              <div className="team-name">
                {match.home?.name || match.teams?.[0] || 'TBD'}
                {match.home?.group && <span className="team-group"> (Grp {match.home.group})</span>}
              </div>
              {match.home?.fifaRanking && (
                <div className="team-ranking">FIFA Rank: #{match.home.fifaRanking}</div>
              )}
            </div>
          </div>

          {/* VS Section */}
          <div className="vs-section">
            <div className="score-display">
              {match.played ? (
                <>
                  <span className="score home-score">{match.homeScore}</span>
                  <span className="score-divider">-</span>
                  <span className="score away-score">{match.awayScore}</span>
                </>
              ) : (
                <span className="vs-text">VS</span>
              )}
            </div>
            <div className="match-time">
              {match.played ? 'FT' : 'TBD'}
            </div>
            {match.winner && (
              <div className="winner-badge">
                {match.winner === match.home ? '🏠' : '✈️'} Winner
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className={`team away-team ${match.winner?.id === match.away?.id ? 'winner' : ''}`}>
            <div className="team-details">
              <div className="team-name">
                {match.away?.name || match.teams?.[1] || 'TBD'}
                {match.away?.group && <span className="team-group"> (Grp {match.away.group})</span>}
              </div>
              {match.away?.fifaRanking && (
                <div className="team-ranking">FIFA Rank: #{match.away.fifaRanking}</div>
              )}
            </div>
            <div className="team-flag">
              {match.away?.countryCode || '🏴'}
            </div>
          </div>
        </div>

        {/* Score Input for editable matches */}
        {isEditable && !match.played && (
          <div className="score-input-section">
            <div className="input-header">
              <span className="input-label">Enter Match Score</span>
              <span className="input-instruction">Numbers 0-20 only</span>
            </div>
            <div className="input-row">
              <div className="input-group">
                <span className="input-team">{match.home?.name?.substring(0, 10) || 'Home'}</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={homeScore}
                  onChange={(e) => handleScoreChange('home', e.target.value)}
                  className="score-input"
                  placeholder="0"
                />
              </div>
              <span className="input-divider">-</span>
              <div className="input-group">
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={awayScore}
                  onChange={(e) => handleScoreChange('away', e.target.value)}
                  className="score-input"
                  placeholder="0"
                />
                <span className="input-team">{match.away?.name?.substring(0, 10) || 'Away'}</span>
              </div>
            </div>
            <button
              onClick={handleScoreSubmit}
              className="submit-score-btn"
              disabled={homeScore === '' || awayScore === ''}
            >
              Set Match Result
            </button>
          </div>
        )}

        {/* Match Requirements */}
        {match.groupRequirements && !match.home && (
          <div className="match-requirements">
            <div className="requirements-title">Match Requirements:</div>
            <div className="requirements-list">
              {Array.isArray(match.groupRequirements[0]) ? (
                <div>Third place from groups: {match.groupRequirements[1].join(', ')}</div>
              ) : (
                match.groupRequirements.map((req, idx) => (
                  <div key={idx}>
                    {typeof req === 'string' ? `Group ${req}` : `Groups ${req.join(', ')}`}
                    {idx === 0 ? ' winner' : idx === 1 ? ' runner-up' : ' third place'}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Next Round Info */}
        {match.winnerAdvancesTo && (
          <div className="next-round-info">
            Winner advances to: <strong>Match {match.winnerAdvancesTo}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;