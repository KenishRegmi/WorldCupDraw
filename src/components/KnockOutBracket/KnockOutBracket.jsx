import React, { useState, useEffect } from 'react';
import { useSimulator } from '../../SimulatorContext';
import MatchCard from '../MatchCard/MatchCard';
import './KnockOutBracket.css';

const KnockOutBracket = () => {
  const { groups, knockout, updateKnockoutMatch, thirdPlaceTeams } = useSimulator();
  const [activeRound, setActiveRound] = useState('roundOf32');
  const [isSimulating, setIsSimulating] = useState(false);
  const [bracketData, setBracketData] = useState(null);

  useEffect(() => {
    setBracketData(knockout);
  }, [knockout]);

  const handleScoreChange = (matchId, homeScore, awayScore) => {
    if (!bracketData) return;

    const numHomeScore = parseInt(homeScore) || 0;
    const numAwayScore = parseInt(awayScore) || 0;
    
    updateKnockoutMatch(matchId, numHomeScore, numAwayScore);
    
    // Update local state for immediate UI feedback
    setBracketData(prev => {
      if (!prev) return null;
      
      const updated = JSON.parse(JSON.stringify(prev));
      const winner = numHomeScore > numAwayScore ? 
        (findMatchById(updated, matchId)?.home || null) : 
        numHomeScore < numAwayScore ? 
        (findMatchById(updated, matchId)?.away || null) : 
        null;
      
      // Update the specific match
      updateMatchInData(updated, matchId, numHomeScore, numAwayScore, winner);
      
      // Handle winner advancement
      advanceWinner(updated, matchId, winner);
      
      return updated;
    });
  };

  const findMatchById = (data, matchId) => {
    const rounds = ['roundOf32', 'roundOf16', 'quarterFinals', 'semiFinals'];
    
    for (const round of rounds) {
      const match = data[round]?.find(m => m.id === matchId);
      if (match) return match;
    }
    
    if (data.thirdPlace?.id === matchId) return data.thirdPlace;
    if (data.final?.id === matchId) return data.final;
    
    return null;
  };

  const updateMatchInData = (data, matchId, homeScore, awayScore, winner) => {
    const rounds = ['roundOf32', 'roundOf16', 'quarterFinals', 'semiFinals'];
    
    for (const round of rounds) {
      const matchIndex = data[round]?.findIndex(m => m.id === matchId);
      if (matchIndex !== -1) {
        data[round][matchIndex].homeScore = homeScore;
        data[round][matchIndex].awayScore = awayScore;
        data[round][matchIndex].winner = winner;
        data[round][matchIndex].played = true;
        return;
      }
    }
    
    if (data.thirdPlace?.id === matchId) {
      data.thirdPlace.homeScore = homeScore;
      data.thirdPlace.awayScore = awayScore;
      data.thirdPlace.winner = winner;
      data.thirdPlace.played = true;
      return;
    }
    
    if (data.final?.id === matchId) {
      data.final.homeScore = homeScore;
      data.final.awayScore = awayScore;
      data.final.winner = winner;
      data.final.played = true;
      return;
    }
  };

  const advanceWinner = (data, matchId, winner) => {
    if (!winner) return;

    // Round of 32 winners advance to Round of 16
    if (matchId >= 73 && matchId <= 88) {
      const roundOf32Match = data.roundOf32.find(m => m.id === matchId);
      if (!roundOf32Match?.winnerAdvancesTo) return;
      
      const roundOf16MatchId = roundOf32Match.winnerAdvancesTo;
      const roundOf16Match = data.roundOf16.find(m => m.id === roundOf16MatchId);
      if (!roundOf16Match) return;
      
      // Determine which slot this winner goes into based on match mapping
      const slot = getRoundOf16Slot(matchId);
      if (slot === 'home') {
        roundOf16Match.home = winner;
      } else if (slot === 'away') {
        roundOf16Match.away = winner;
      }
      
      roundOf16Match.played = !!(roundOf16Match.home && roundOf16Match.away);
    }
    
    // Round of 16 winners advance to Quarter Finals
    else if (matchId >= 89 && matchId <= 96) {
      const roundOf16Match = data.roundOf16.find(m => m.id === matchId);
      if (!roundOf16Match?.winnerAdvancesTo) return;
      
      const quarterFinalMatchId = roundOf16Match.winnerAdvancesTo;
      const quarterFinalMatch = data.quarterFinals.find(m => m.id === quarterFinalMatchId);
      if (!quarterFinalMatch) return;
      
      const slot = getQuarterFinalSlot(matchId);
      if (slot === 'home') {
        quarterFinalMatch.home = winner;
      } else if (slot === 'away') {
        quarterFinalMatch.away = winner;
      }
      
      quarterFinalMatch.played = !!(quarterFinalMatch.home && quarterFinalMatch.away);
    }
    
    // Quarter Final winners advance to Semi Finals
    else if (matchId >= 97 && matchId <= 100) {
      const quarterFinalMatch = data.quarterFinals.find(m => m.id === matchId);
      if (!quarterFinalMatch?.winnerAdvancesTo) return;
      
      const semiFinalMatchId = quarterFinalMatch.winnerAdvancesTo;
      const semiFinalMatch = data.semiFinals.find(m => m.id === semiFinalMatchId);
      if (!semiFinalMatch) return;
      
      const slot = getSemiFinalSlot(matchId);
      if (slot === 'home') {
        semiFinalMatch.home = winner;
      } else if (slot === 'away') {
        semiFinalMatch.away = winner;
      }
      
      semiFinalMatch.played = !!(semiFinalMatch.home && semiFinalMatch.away);
    }
    
    // Semi Final winners/losers go to Final/Third Place
    else if (matchId === 101 || matchId === 102) {
      const semiFinalMatch = data.semiFinals.find(m => m.id === matchId);
      if (!semiFinalMatch) return;
      
      // Winner goes to Final
      if (semiFinalMatch.winner) {
        const finalMatch = data.final;
        if (matchId === 101) {
          finalMatch.home = semiFinalMatch.winner;
        } else if (matchId === 102) {
          finalMatch.away = semiFinalMatch.winner;
        }
        finalMatch.played = !!(finalMatch.home && finalMatch.away);
      }
      
      // Loser goes to Third Place
      const loser = semiFinalMatch.homeScore > semiFinalMatch.awayScore 
        ? semiFinalMatch.away 
        : semiFinalMatch.homeScore < semiFinalMatch.awayScore 
          ? semiFinalMatch.home 
          : null;
      
      if (loser) {
        const thirdPlaceMatch = data.thirdPlace;
        if (matchId === 101) {
          thirdPlaceMatch.home = loser;
        } else if (matchId === 102) {
          thirdPlaceMatch.away = loser;
        }
        thirdPlaceMatch.played = !!(thirdPlaceMatch.home && thirdPlaceMatch.away);
      }
    }
  };

  const getRoundOf16Slot = (matchId) => {
    const mapping = {
      73: 'home', // Match 73 winner → Match 90 home
      74: 'home', // Match 74 winner → Match 89 home
      75: 'away', // Match 75 winner → Match 90 away
      76: 'home', // Match 76 winner → Match 91 home
      77: 'away', // Match 77 winner → Match 89 away
      78: 'away', // Match 78 winner → Match 91 away
      79: 'home', // Match 79 winner → Match 92 home
      80: 'away', // Match 80 winner → Match 92 away
      81: 'home', // Match 81 winner → Match 93 home
      82: 'home', // Match 82 winner → Match 94 home
      83: 'away', // Match 83 winner → Match 94 away
      84: 'away', // Match 84 winner → Match 93 away
      85: 'home', // Match 85 winner → Match 96 home
      86: 'home', // Match 86 winner → Match 95 home
      87: 'away', // Match 87 winner → Match 96 away
      88: 'away', // Match 88 winner → Match 95 away
    };
    return mapping[matchId];
  };

  const getQuarterFinalSlot = (matchId) => {
    const mapping = {
      89: 'home', // Match 89 winner → Match 97 home
      90: 'away', // Match 90 winner → Match 97 away
      91: 'home', // Match 91 winner → Match 99 home
      92: 'away', // Match 92 winner → Match 99 away
      93: 'home', // Match 93 winner → Match 98 home
      94: 'away', // Match 94 winner → Match 98 away
      95: 'home', // Match 95 winner → Match 100 home
      96: 'away', // Match 96 winner → Match 100 away
    };
    return mapping[matchId];
  };

  const getSemiFinalSlot = (matchId) => {
    const mapping = {
      97: 'home', // Match 97 winner → Match 101 home
      98: 'away', // Match 98 winner → Match 101 away
      99: 'home', // Match 99 winner → Match 102 home
      100: 'away', // Match 100 winner → Match 102 away
    };
    return mapping[matchId];
  };

  const simulateAllMatches = () => {
    if (!bracketData || isSimulating) return;
    
    setIsSimulating(true);
    
    // Simulate Round of 32
    const simulatedRound32 = bracketData.roundOf32.map(match => {
      if (match.home && match.away && !match.played) {
        const homeScore = Math.floor(Math.random() * 4);
        const awayScore = Math.floor(Math.random() * 3);
        const winner = homeScore > awayScore ? match.home : homeScore < awayScore ? match.away : null;
        
        updateKnockoutMatch(match.id, homeScore, awayScore, winner);
        return { ...match, homeScore, awayScore, winner, played: true };
      }
      return match;
    });
    
    // After a delay, simulate Round of 16
    setTimeout(() => {
      const updatedData = JSON.parse(JSON.stringify(bracketData));
      updatedData.roundOf32 = simulatedRound32;
      setBracketData(updatedData);
      
      // Simulate Round of 16 after Round of 32 is complete
      const readyForRound16 = updatedData.roundOf32.every(m => m.played) && 
                              updatedData.roundOf16.every(m => m.home && m.away);
      
      if (readyForRound16) {
        const simulatedRound16 = updatedData.roundOf16.map(match => {
          if (match.home && match.away && !match.played) {
            const homeScore = Math.floor(Math.random() * 3);
            const awayScore = Math.floor(Math.random() * 3);
            const winner = homeScore > awayScore ? match.home : homeScore < awayScore ? match.away : null;
            
            updateKnockoutMatch(match.id, homeScore, awayScore, winner);
            return { ...match, homeScore, awayScore, winner, played: true };
          }
          return match;
        });
        
        setTimeout(() => {
          updatedData.roundOf16 = simulatedRound16;
          setBracketData(updatedData);
          setIsSimulating(false);
        }, 500);
      } else {
        setIsSimulating(false);
      }
    }, 500);
  };

  const resetKnockout = () => {
    const resetData = {
      roundOf32: knockout.roundOf32.map(m => ({ ...m, homeScore: null, awayScore: null, winner: null, played: false })),
      roundOf16: knockout.roundOf16.map(m => ({ ...m, home: null, away: null, homeScore: null, awayScore: null, winner: null, played: false })),
      quarterFinals: knockout.quarterFinals.map(m => ({ ...m, home: null, away: null, homeScore: null, awayScore: null, winner: null, played: false })),
      semiFinals: knockout.semiFinals.map(m => ({ ...m, home: null, away: null, homeScore: null, awayScore: null, winner: null, played: false })),
      thirdPlace: { ...knockout.thirdPlace, home: null, away: null, homeScore: null, awayScore: null, winner: null, played: false },
      final: { ...knockout.final, home: null, away: null, homeScore: null, awayScore: null, winner: null, played: false }
    };
    
    setBracketData(resetData);
  };

  if (!bracketData) {
    return (
      <div className="loading-bracket">
        <h3>Loading knockout bracket...</h3>
        <p>Complete group stage matches to generate knockout bracket</p>
      </div>
    );
  }

  const allGroupsComplete = Object.values(groups).every(g => g.isCompleted);
  const roundOf32Ready = bracketData.roundOf32.every(m => m.home && m.away);

  return (
    <div className="knockout-bracket">
      <div className="bracket-header">
        <h2>Knockout Stage</h2>
        <div className="bracket-status">
          {!allGroupsComplete ? (
            <span className="status-warning">⚠️ Complete all group matches first</span>
          ) : !roundOf32Ready ? (
            <span className="status-info">ℹ️ Calculating qualified teams...</span>
          ) : (
            <span className="status-success">✓ Ready for knockout stage</span>
          )}
        </div>
      </div>

      <div className="bracket-controls">
        <div className="round-selector">
          {['roundOf32', 'roundOf16', 'quarterFinals', 'semiFinals', 'final'].map(round => (
            <button
              key={round}
              className={`round-btn ${activeRound === round ? 'active' : ''}`}
              onClick={() => setActiveRound(round)}
            >
              {round.replace(/([A-Z])/g, ' $1').replace('Of', 'of')}
            </button>
          ))}
        </div>

        <div className="simulation-controls">
          <button
            onClick={simulateAllMatches}
            className="simulate-btn"
            disabled={!allGroupsComplete || !roundOf32Ready || isSimulating}
          >
            {isSimulating ? 'Simulating...' : 'Simulate Entire Knockout Stage'}
          </button>
          <button
            onClick={resetKnockout}
            className="reset-btn"
          >
            Reset Knockout
          </button>
        </div>
      </div>

      <div className="bracket-content">
        {/* Round of 32 */}
        {activeRound === 'roundOf32' && (
          <div className="round-container">
            <h3 className="round-title">Round of 32</h3>
            <div className="matches-grid">
              {bracketData.roundOf32.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onScoreChange={handleScoreChange}
                  isEditable={true}
                  stage="roundOf32"
                />
              ))}
            </div>
          </div>
        )}

        {/* Round of 16 */}
        {activeRound === 'roundOf16' && (
          <div className="round-container">
            <h3 className="round-title">Round of 16</h3>
            <div className="matches-grid">
              {bracketData.roundOf16.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onScoreChange={handleScoreChange}
                  isEditable={true}
                  stage="roundOf16"
                />
              ))}
            </div>
          </div>
        )}

        {/* Quarter Finals */}
        {activeRound === 'quarterFinals' && (
          <div className="round-container">
            <h3 className="round-title">Quarter Finals</h3>
            <div className="matches-grid quarter-finals">
              {bracketData.quarterFinals.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onScoreChange={handleScoreChange}
                  isEditable={true}
                  stage="quarterFinals"
                />
              ))}
            </div>
          </div>
        )}

        {/* Semi Finals */}
        {activeRound === 'semiFinals' && (
          <div className="round-container">
            <h3 className="round-title">Semi Finals</h3>
            <div className="matches-grid semi-finals">
              {bracketData.semiFinals.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onScoreChange={handleScoreChange}
                  isEditable={true}
                  stage="semiFinals"
                />
              ))}
            </div>
          </div>
        )}

        {/* Final and Third Place */}
        {activeRound === 'final' && (
          <div className="final-round">
            <div className="third-place-match">
              <h3 className="round-title">Third Place Match</h3>
              <MatchCard
                match={bracketData.thirdPlace}
                onScoreChange={handleScoreChange}
                isEditable={true}
                stage="thirdPlace"
              />
            </div>
            <div className="final-match">
              <h3 className="round-title">WORLD CUP FINAL</h3>
              <MatchCard
                match={bracketData.final}
                onScoreChange={handleScoreChange}
                isEditable={true}
                stage="final"
              />
            </div>
          </div>
        )}

        {/* Winner Display */}
        {bracketData.final.winner && (
          <div className="champion-display">
            <div className="champion-trophy">🏆</div>
            <div className="champion-info">
              <div className="champion-title">WORLD CUP 2026 CHAMPION</div>
              <div className="champion-name">{bracketData.final.winner.name}</div>
              {bracketData.final.winner.group && (
                <div className="champion-details">
                  Winner of Group {bracketData.final.winner.group}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bracket-info">
        <h4>Knockout Stage Information</h4>
        <ul>
          <li>All group stage matches must be completed to generate knockout bracket</li>
          <li>Top 2 teams from each group qualify for Round of 32</li>
          <li>Best 8 third-place teams also qualify for Round of 32</li>
          <li>Extra time and penalties are not simulated in this version</li>
          <li>Click "Simulate Entire Knockout Stage" to auto-generate all results</li>
        </ul>
      </div>
    </div>
  );
};

export default KnockOutBracket;