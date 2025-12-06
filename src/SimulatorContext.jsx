import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { groups as initialGroups } from './data/groups';
import { knockoutFormat } from './data/knockoutFormat';

const SimulatorContext = createContext();

export const useSimulator = () => useContext(SimulatorContext);

export const SimulatorProvider = ({ children }) => {
  const initializeGroups = () => {
    const groupsData = {};
    
    Object.entries(initialGroups).forEach(([groupId, teamNames]) => {
      const teams = teamNames.map((name, index) => ({
        id: `${groupId}${index + 1}`,
        name: name,
        group: groupId,
        points: 0,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        gs: 0,
        ga: 0,
        gd: 0
      }));

      const matches = [
        { id: `${groupId}1`, home: teams[0], away: teams[1], homeScore: null, awayScore: null, played: false },
        { id: `${groupId}2`, home: teams[2], away: teams[3], homeScore: null, awayScore: null, played: false },
        { id: `${groupId}3`, home: teams[0], away: teams[2], homeScore: null, awayScore: null, played: false },
        { id: `${groupId}4`, home: teams[3], away: teams[1], homeScore: null, awayScore: null, played: false },
        { id: `${groupId}5`, home: teams[1], away: teams[2], homeScore: null, awayScore: null, played: false },
        { id: `${groupId}6`, home: teams[3], away: teams[0], homeScore: null, awayScore: null, played: false },
      ];

      groupsData[groupId] = {
        id: groupId,
        teams,
        matches,
        isCompleted: false
      };
    });

    return groupsData;
  };

  const initializeKnockout = () => {
    const knockoutData = {};

    knockoutData.roundOf32 = knockoutFormat.roundOf32.map(match => ({
      ...match,
      home: null,
      away: null,
      homeScore: null,
      awayScore: null,
      winner: null,
      played: false
    }));

    knockoutData.roundOf16 = knockoutFormat.roundOf16.map(match => ({
      ...match,
      home: null,
      away: null,
      homeScore: null,
      awayScore: null,
      winner: null,
      played: false
    }));

    knockoutData.quarterFinals = knockoutFormat.quarterFinals.map(match => ({
      ...match,
      home: null,
      away: null,
      homeScore: null,
      awayScore: null,
      winner: null,
      played: false
    }));

    knockoutData.semiFinals = knockoutFormat.semiFinals.map(match => ({
      ...match,
      home: null,
      away: null,
      homeScore: null,
      awayScore: null,
      winner: null,
      played: false
    }));

    knockoutData.thirdPlace = {
      ...knockoutFormat.thirdPlace,
      home: null,
      away: null,
      homeScore: null,
      awayScore: null,
      winner: null,
      played: false
    };

    knockoutData.final = {
      ...knockoutFormat.final,
      home: null,
      away: null,
      homeScore: null,
      awayScore: null,
      winner: null,
      played: false
    };

    return knockoutData;
  };

  const [groups, setGroups] = useState(() => initializeGroups());
  const [knockout, setKnockout] = useState(() => initializeKnockout());
  const [thirdPlaceTeams, setThirdPlaceTeams] = useState([]);
  const [activeTab, setActiveTab] = useState('groups');

  const updateGroupMatch = useCallback((groupId, matchId, homeScore, awayScore) => {
    setGroups(prev => {
      const updatedGroups = { ...prev };
      const group = updatedGroups[groupId];
      
      const matchIndex = group.matches.findIndex(m => m.id === matchId);
      if (matchIndex === -1) return prev;

      const oldMatch = group.matches[matchIndex];
      const newMatch = {
        ...oldMatch,
        homeScore: parseInt(homeScore) || 0,
        awayScore: parseInt(awayScore) || 0,
        played: true
      };

      const teamsCopy = group.teams.map(team => ({ ...team }));

      if (oldMatch.played) {
        const oldWinner = oldMatch.homeScore > oldMatch.awayScore ? oldMatch.home : 
                         oldMatch.homeScore < oldMatch.awayScore ? oldMatch.away : null;
        
        teamsCopy.forEach(team => {
          if (team.id === oldMatch.home.id) {
            team.played--;
            team.gs -= oldMatch.homeScore;
            team.ga -= oldMatch.awayScore;
            if (oldWinner === oldMatch.home) team.wins--;
            else if (oldWinner === oldMatch.away) team.losses--;
            else team.draws--;
          }
          if (team.id === oldMatch.away.id) {
            team.played--;
            team.gs -= oldMatch.awayScore;
            team.ga -= oldMatch.homeScore;
            if (oldWinner === oldMatch.away) team.wins--;
            else if (oldWinner === oldMatch.home) team.losses--;
            else team.draws--;
          }
        });
      }

      const homeTeam = teamsCopy.find(t => t.id === newMatch.home.id);
      const awayTeam = teamsCopy.find(t => t.id === newMatch.away.id);

      if (homeTeam && awayTeam) {
        homeTeam.played++;
        homeTeam.gs += newMatch.homeScore;
        homeTeam.ga += newMatch.awayScore;
        
        awayTeam.played++;
        awayTeam.gs += newMatch.awayScore;
        awayTeam.ga += newMatch.homeScore;

        if (newMatch.homeScore > newMatch.awayScore) {
          homeTeam.wins++;
          awayTeam.losses++;
        } else if (newMatch.homeScore < newMatch.awayScore) {
          awayTeam.wins++;
          homeTeam.losses++;
        } else {
          homeTeam.draws++;
          awayTeam.draws++;
        }

        homeTeam.points = homeTeam.wins * 3 + homeTeam.draws;
        awayTeam.points = awayTeam.wins * 3 + awayTeam.draws;
        
        homeTeam.gd = homeTeam.gs - homeTeam.ga;
        awayTeam.gd = awayTeam.gs - awayTeam.ga;
      }

      const updatedMatches = [...group.matches];
      updatedMatches[matchIndex] = newMatch;

      const allPlayed = updatedMatches.every(m => m.played);

      return {
        ...updatedGroups,
        [groupId]: {
          ...group,
          teams: teamsCopy,
          matches: updatedMatches,
          isCompleted: allPlayed
        }
      };
    });
  }, []);

  const updateKnockoutMatch = useCallback((matchId, homeScore, awayScore, winner = null) => {
    setKnockout(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      
      const findAndUpdateMatch = (roundMatches, roundKey) => {
        const matchIndex = roundMatches.findIndex(m => m.id === matchId);
        if (matchIndex !== -1) {
          roundMatches[matchIndex].homeScore = homeScore;
          roundMatches[matchIndex].awayScore = awayScore;
          roundMatches[matchIndex].winner = winner || 
            (homeScore > awayScore ? roundMatches[matchIndex].home : 
             homeScore < awayScore ? roundMatches[matchIndex].away : null);
          roundMatches[matchIndex].played = true;
          return true;
        }
        return false;
      };

      if (findAndUpdateMatch(updated.roundOf32, 'roundOf32')) return updated;
      if (findAndUpdateMatch(updated.roundOf16, 'roundOf16')) return updated;
      if (findAndUpdateMatch(updated.quarterFinals, 'quarterFinals')) return updated;
      if (findAndUpdateMatch(updated.semiFinals, 'semiFinals')) return updated;
      
      if (updated.thirdPlace.id === matchId) {
        updated.thirdPlace.homeScore = homeScore;
        updated.thirdPlace.awayScore = awayScore;
        updated.thirdPlace.winner = winner || 
          (homeScore > awayScore ? updated.thirdPlace.home : 
           homeScore < awayScore ? updated.thirdPlace.away : null);
        updated.thirdPlace.played = true;
        return updated;
      }
      
      if (updated.final.id === matchId) {
        updated.final.homeScore = homeScore;
        updated.final.awayScore = awayScore;
        updated.final.winner = winner || 
          (homeScore > awayScore ? updated.final.home : 
           homeScore < awayScore ? updated.final.away : null);
        updated.final.played = true;
        return updated;
      }
      
      return prev;
    });
  }, []);

  const setKnockoutTeams = useCallback((roundOf32Assignments) => {
    setKnockout(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      
      Object.entries(roundOf32Assignments).forEach(([matchId, team]) => {
        const matchIndex = updated.roundOf32.findIndex(m => m.id === parseInt(matchId));
        if (matchIndex !== -1) {
          const match = updated.roundOf32[matchIndex];
          if (match.teams[0].includes('third place')) {
            updated.roundOf32[matchIndex].away = team;
          } else {
            updated.roundOf32[matchIndex].home = team;
          }
          updated.roundOf32[matchIndex].played = false;
        }
      });
      
      return updated;
    });
  }, []);

  const calculateGroupStandings = useCallback((group) => {
    return [...group.teams].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gs !== a.gs) return b.gs - a.gs;
      return a.name.localeCompare(b.name);
    });
  }, []);

  const resetAll = useCallback(() => {
    setGroups(initializeGroups());
    setKnockout(initializeKnockout());
    setThirdPlaceTeams([]);
  }, []);

  const exportResults = useCallback(() => {
    const allResults = [];
    
    Object.values(groups).forEach(group => {
      group.matches.forEach(match => {
        if (match.played) {
          allResults.push({
            Group: group.id,
            Match: match.id,
            Home: match.home.name,
            Away: match.away.name,
            HomeScore: match.homeScore,
            AwayScore: match.awayScore
          });
        }
      });
    });

    const csv = [
      ['Group', 'Match', 'Home', 'Away', 'Home Score', 'Away Score'].join(','),
      ...allResults.map(r => [r.Group, r.Match, `"${r.Home}"`, `"${r.Away}"`, r.HomeScore, r.AwayScore].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'world-cup-2026-results.csv';
    a.click();
  }, [groups]);

  const importResults = useCallback((csvText) => {
    resetAll();
    
    const lines = csvText.split('\n').slice(1);
    lines.forEach(line => {
      if (line.trim()) {
        const [groupId, matchId, homeName, awayName, homeScore, awayScore] = line.split(',').map(cell => cell.replace(/"/g, '').trim());
        if (groupId && matchId) {
          updateGroupMatch(groupId, matchId, parseInt(homeScore), parseInt(awayScore));
        }
      }
    });
  }, [updateGroupMatch, resetAll]);

  const value = useMemo(() => ({
    groups,
    knockout,
    thirdPlaceTeams,
    activeTab,
    setActiveTab,
    updateGroupMatch,
    updateKnockoutMatch,
    calculateGroupStandings,
    setKnockoutTeams,
    resetAll,
    exportResults,
    importResults,
    setThirdPlaceTeams
  }), [groups, knockout, thirdPlaceTeams, activeTab, updateGroupMatch, updateKnockoutMatch, calculateGroupStandings, setKnockoutTeams, resetAll, exportResults, importResults]);

  return (
    <SimulatorContext.Provider value={value}>
      {children}
    </SimulatorContext.Provider>
  );
};

export default SimulatorContext;