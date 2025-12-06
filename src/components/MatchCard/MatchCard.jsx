// src/components/MatchCard/MatchCard.jsx
import React, { useState } from 'react';
import './MatchCard.css';

const MatchCard = ({ match, onScoreChange, isEditable = false, stage = 'group' }) => {
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');

  const handleScoreSubmit = () => {
    if (homeScore === '' || awayScore === '' || !onScoreChange) return;
    onScoreChange(match.id, parseInt(homeScore, 10), parseInt(awayScore, 10));
    setHomeScore('');
    setAwayScore('');
  };

  const handleLocalChange = (team, value) => {
    const num = value === '' ? '' : Math.max(0, Math.min(20, parseInt(value, 10) || 0));
    if (team === 'home') setHomeScore(num);
    else setAwayScore(num);
  };

  const getStageColor = () => {
    switch (stage) {
      case 'roundOf32':
        return '#2563eb';
      case 'roundOf16':
        return '#7c3aed';
      case 'quarterFinals':
        return '#059669';
      case 'semiFinals':
        return '#ea580c';
      case 'thirdPlace':
        return '#dc2626';
      case 'final':
        return '#db2777';
      default:
        return '#6b7280';
    }
  };

  const getStageLabel = () => {
    switch (stage) {
      case 'roundOf32':
        return 'Round of 32';
      case 'roundOf16':
        return 'Round of 16';
      case 'quarterFinals':
        return 'Quarter-finals';
      case 'semiFinals':
        return 'Semi-finals';
      case 'thirdPlace':
        return 'Third-place match';
      case 'final':
        return 'Final';
      default:
        return 'Group stage';
    }
  };

  const isThirdPlaceMatch = match.id === 103;
  const isFinalMatch = match.id === 104;

  return (
    <div
      className={
        'match-card ' +
        `match-card--${stage} ` +
        (match.played ? 'match-card--played ' : 'match-card--upcoming ') +
        (isFinalMatch ? 'match-card--final' : '')
      }
    >
      <div className="match-card__header" style={{ borderColor: getStageColor() }}>
        <div className="match-card__header-main">
          <span className="match-card__name">{match.name}</span>
          <span className="match-card__stage">
            {isFinalMatch
              ? 'World Cup final'
              : isThirdPlaceMatch
              ? 'Third-place playoff'
              : getStageLabel()}
          </span>
        </div>
        {match.stadium && (
          <div className="match-card__stadium">
            <span className="match-card__stadium-icon">🏟</span>
            <span className="match-card__stadium-name">{match.stadium}</span>
          </div>
        )}
      </div>

      <div className="match-card__body">
        <div className="match-card__team match-card__team--home">
          <div className="match-card__team-flag">
            <span role="img" aria-label="home-flag">
              {match.home?.countryCode || '🏳️'}
            </span>
          </div>
          <div className="match-card__team-info">
            <div className="match-card__team-name">
              {match.home?.name || match.teams?.[0] || 'TBD'}
            </div>
          </div>
        </div>

        <div className="match-card__center">
          <div className="match-card__score">
            {match.played ? (
              <>
                <span className="match-card__score-num match-card__score-num--home">
                  {match.homeScore}
                </span>
                <span className="match-card__score-separator">-</span>
                <span className="match-card__score-num match-card__score-num--away">
                  {match.awayScore}
                </span>
              </>
            ) : (
              <span className="match-card__score-vs">VS</span>
            )}
          </div>
          <div className="match-card__time">
            {match.played ? 'FT' : 'TBD'}
          </div>
          {match.winner && (
            <div className="match-card__winner">
              {match.winner === match.home ? 'Home winner' : 'Away winner'}
            </div>
          )}
        </div>

        <div className="match-card__team match-card__team--away">
          <div className="match-card__team-info match-card__team-info--right">
            <div className="match-card__team-name match-card__team-name--right">
              {match.away?.name || match.teams?.[1] || 'TBD'}
            </div>
          </div>
          <div className="match-card__team-flag">
            <span role="img" aria-label="away-flag">
              {match.away?.countryCode || '🏳️'}
            </span>
          </div>
        </div>
      </div>

      {isEditable && !match.played && (
        <div className="match-card__inputs">
          <div className="match-card__inputs-row">
            <div className="match-card__inputs-group">
              <span className="match-card__inputs-label">
                {match.home?.name?.slice(0, 10) || 'Home'}
              </span>
              <input
                type="number"
                min="0"
                max="20"
                value={homeScore}
                onChange={(e) => handleLocalChange('home', e.target.value)}
                className="match-card__input"
                placeholder="0"
              />
            </div>
            <span className="match-card__inputs-separator">-</span>
            <div className="match-card__inputs-group">
              <input
                type="number"
                min="0"
                max="20"
                value={awayScore}
                onChange={(e) => handleLocalChange('away', e.target.value)}
                className="match-card__input"
                placeholder="0"
              />
              <span className="match-card__inputs-label">
                {match.away?.name?.slice(0, 10) || 'Away'}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="match-card__submit"
            onClick={handleScoreSubmit}
            disabled={homeScore === '' || awayScore === ''}
          >
            Set match result
          </button>
        </div>
      )}

      {match.groupRequirements && !match.home && (
        <div className="match-card__requirements">
          <div className="match-card__requirements-title">Match requirements:</div>
          <div className="match-card__requirements-body">
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

      {match.winnerAdvancesTo && (
        <div className="match-card__next">
          Winner advances to match <strong>{match.winnerAdvancesTo}</strong>
        </div>
      )}
    </div>
  );
};

export default MatchCard;
