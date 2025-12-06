// src/context/SimulatorContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { groups as rawGroups } from '../data/groups';
import { knockoutFormat } from '../data/knockoutFormat';
import { calculateThirdPlaceTeams, assignThirdPlaceTeams } from '../utils/thirdPlace';

const SimulatorContext = createContext();

export const useSimulator = () => useContext(SimulatorContext);

export const SimulatorProvider = ({ children }) => {
  // ---------- INIT HELPERS ----------

  const initializeGroups = () => {
    const groupState = {};

    Object.entries(rawGroups).forEach(([groupId, teamNames]) => {
      const teams = teamNames.map((name, index) => ({
        id: `${groupId}${index + 1}`,
        name,
        group: groupId,
        points: 0,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        gs: 0,
        ga: 0,
        gd: 0,
      }));

      const matches = [
        { id: `${groupId}1`, home: teams[0], away: teams[1], homeScore: null, awayScore: null, played: false },
        { id: `${groupId}2`, home: teams[2], away: teams[3], homeScore: null, awayScore: null, played: false },
        { id: `${groupId}3`, home: teams[0], away: teams[2], homeScore: null, awayScore: null, played: false },
        { id: `${groupId}4`, home: teams[3], away: teams[1], homeScore: null, awayScore: null, played: false },
        { id: `${groupId}5`, home: teams[1], away: teams[2], homeScore: null, awayScore: null, played: false },
        { id: `${groupId}6`, home: teams[3], away: teams[0], homeScore: null, awayScore: null, played: false },
      ];

      groupState[groupId] = {
        id: groupId,
        teams,
        matches,
        isCompleted: false,
      };
    });

    return groupState;
  };

  const initializeKnockout = () => {
    const k = {};

    k.roundOf32 = knockoutFormat.roundOf32.map((m) => ({
      ...m,
      home: null,
      away: null,
      homeScore: null,
      awayScore: null,
      winner: null,
      played: false,
    }));

    k.roundOf16 = knockoutFormat.roundOf16.map((m) => ({
      ...m,
      home: null,
      away: null,
      homeScore: null,
      awayScore: null,
      winner: null,
      played: false,
    }));

    k.quarterFinals = knockoutFormat.quarterFinals.map((m) => ({
      ...m,
      home: null,
      away: null,
      homeScore: null,
      awayScore: null,
      winner: null,
      played: false,
    }));

    k.semiFinals = knockoutFormat.semiFinals.map((m) => ({
      ...m,
      home: null,
      away: null,
      homeScore: null,
      awayScore: null,
      winner: null,
      played: false,
    }));

    k.thirdPlace = {
      ...knockoutFormat.thirdPlace,
      home: null,
      away: null,
      homeScore: null,
      awayScore: null,
      winner: null,
      played: false,
    };

    k.final = {
      ...knockoutFormat.final,
      home: null,
      away: null,
      homeScore: null,
      awayScore: null,
      winner: null,
      played: false,
    };

    return k;
  };

  // ---------- STATE ----------

  const [groups, setGroups] = useState(() => initializeGroups());
  const [knockout, setKnockout] = useState(() => initializeKnockout());
  const [thirdPlaceTeams, setThirdPlaceTeams] = useState([]);
  const [activeTab, setActiveTab] = useState('groups');

  // ---------- HELPERS ----------

  const calculateGroupStandings = useCallback((group) => {
    return [...group.teams].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gs !== a.gs) return b.gs - a.gs;
      return a.name.localeCompare(b.name);
    });
  }, []);

  const groupHasAnyMatch = (group) => group.matches.some((m) => m.played);

  // Use current leaders to fill Round of 32
  const fillRoundOf32 = useCallback(
    (groupsState) => {
      const winners = {};
      const runners = {};

      // current 1st/2nd for any group that has started
      Object.values(groupsState).forEach((group) => {
        if (!groupHasAnyMatch(group)) return;
        const sorted = calculateGroupStandings(group);
        if (sorted[0]) winners[group.id] = sorted[0];
        if (sorted[1]) runners[group.id] = sorted[1];
      });

      const assignments = {};

      // ---- fixed winner / runner-up matches ----

      // Match 73: Group A runners-up vs Group B runners-up
      if (runners.A) {
        assignments[73] = { ...(assignments[73] || {}), home: runners.A };
      }
      if (runners.B) {
        assignments[73] = { ...(assignments[73] || {}), away: runners.B };
      }

      // Match 75: Group F winners vs Group C runners-up
      if (winners.F) {
        assignments[75] = { ...(assignments[75] || {}), home: winners.F };
      }
      if (runners.C) {
        assignments[75] = { ...(assignments[75] || {}), away: runners.C };
      }

      // Match 76: Group C winners vs Group F runners-up
      if (winners.C) {
        assignments[76] = { ...(assignments[76] || {}), home: winners.C };
      }
      if (runners.F) {
        assignments[76] = { ...(assignments[76] || {}), away: runners.F };
      }

      // Match 78: Group E runners-up vs Group I runners-up
      if (runners.E) {
        assignments[78] = { ...(assignments[78] || {}), home: runners.E };
      }
      if (runners.I) {
        assignments[78] = { ...(assignments[78] || {}), away: runners.I };
      }

      // Match 83: Group K runners-up vs Group L runners-up
      if (runners.K) {
        assignments[83] = { ...(assignments[83] || {}), home: runners.K };
      }
      if (runners.L) {
        assignments[83] = { ...(assignments[83] || {}), away: runners.L };
      }

      // Match 84: Group H winners vs Group J runners-up
      if (winners.H) {
        assignments[84] = { ...(assignments[84] || {}), home: winners.H };
      }
      if (runners.J) {
        assignments[84] = { ...(assignments[84] || {}), away: runners.J };
      }

      // Match 88: Group D runners-up vs Group G runners-up
      if (runners.D) {
        assignments[88] = { ...(assignments[88] || {}), home: runners.D };
      }
      if (runners.G) {
        assignments[88] = { ...(assignments[88] || {}), away: runners.G };
      }

      // ---- third-place slots ----
      // only once all groups have at least one match and 8 thirds exist

      const allGroupsStarted = Object.values(groupsState).every(groupHasAnyMatch);
      if (allGroupsStarted) {
        const thirds = calculateThirdPlaceTeams(groupsState);
        setThirdPlaceTeams(thirds);

        const qualifiedThirds = thirds.slice(0, 8);
        if (qualifiedThirds.length === 8) {
          const thirdAssignments = assignThirdPlaceTeams(qualifiedThirds);

          knockoutFormat.roundOf32.forEach((templateMatch) => {
            const id = templateMatch.id;
            const thirdTeam = thirdAssignments[id];
            if (!thirdTeam) return;

            const [fixedGroup] = templateMatch.groupRequirements;
            if (!fixedGroup || !winners[fixedGroup]) return;

            const winnerSideIsHome = templateMatch.teams[0].toLowerCase().includes('winners');
            if (winnerSideIsHome) {
              assignments[id] = {
                ...(assignments[id] || {}),
                home: winners[fixedGroup],
                away: thirdTeam,
              };
            } else {
              assignments[id] = {
                ...(assignments[id] || {}),
                home: thirdTeam,
                away: winners[fixedGroup],
              };
            }
          });
        }
      } else {
        setThirdPlaceTeams([]);
      }

      return assignments;
    },
    [calculateGroupStandings]
  );

  // ---------- GROUP LOGIC ----------

  const updateGroupMatch = useCallback(
    (groupId, matchId, homeScore, awayScore) => {
      setGroups((prev) => {
        const updated = { ...prev };
        const group = updated[groupId];
        if (!group) return prev;

        const matchIndex = group.matches.findIndex((m) => m.id === matchId);
        if (matchIndex === -1) return prev;

        const oldMatch = group.matches[matchIndex];
        const newMatch = {
          ...oldMatch,
          homeScore: Number(homeScore) ?? 0,
          awayScore: Number(awayScore) ?? 0,
          played: true,
        };

        const teamsCopy = group.teams.map((t) => ({ ...t }));

        if (oldMatch.played) {
          const oldWinner =
            oldMatch.homeScore > oldMatch.awayScore
              ? oldMatch.home
              : oldMatch.homeScore < oldMatch.awayScore
              ? oldMatch.away
              : null;

          teamsCopy.forEach((team) => {
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

        const homeTeam = teamsCopy.find((t) => t.id === newMatch.home.id);
        const awayTeam = teamsCopy.find((t) => t.id === newMatch.away.id);

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

        const matches = [...group.matches];
        matches[matchIndex] = newMatch;
        const allPlayed = matches.every((m) => m.played);

        const newGroups = {
          ...updated,
          [groupId]: {
            ...group,
            teams: teamsCopy,
            matches,
            isCompleted: allPlayed,
          },
        };

        // recompute Round of 32 using current leaders and thirds logic
        const r32Assignments = fillRoundOf32(newGroups);
        setKnockout((prevKo) => {
          const next = JSON.parse(JSON.stringify(prevKo));
          next.roundOf32 = next.roundOf32.map((m) => {
            const slot = r32Assignments[m.id];
            if (!slot) return m;
            return {
              ...m,
              home: slot.home ?? m.home,
              away: slot.away ?? m.away,
            };
          });
          return next;
        });

        return newGroups;
      });
    },
    [fillRoundOf32]
  );

  const resetAll = useCallback(() => {
    setGroups(initializeGroups());
    setKnockout(initializeKnockout());
    setThirdPlaceTeams([]);
  }, []);

  // ---------- KNOCKOUT LOGIC ----------

  const updateKnockoutMatch = useCallback((matchId, homeScore, awayScore, winner = null) => {
    setKnockout((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));

      const findAndUpdate = (matches) => {
        const idx = matches.findIndex((m) => m.id === matchId);
        if (idx === -1) return false;
        const match = matches[idx];
        match.homeScore = homeScore;
        match.awayScore = awayScore;
        match.winner =
          winner ||
          (homeScore > awayScore ? match.home : homeScore < awayScore ? match.away : null);
        match.played = true;
        return true;
      };

      if (findAndUpdate(updated.roundOf32)) return updated;
      if (findAndUpdate(updated.roundOf16)) return updated;
      if (findAndUpdate(updated.quarterFinals)) return updated;
      if (findAndUpdate(updated.semiFinals)) return updated;

      if (updated.thirdPlace.id === matchId) {
        const match = updated.thirdPlace;
        match.homeScore = homeScore;
        match.awayScore = awayScore;
        match.winner =
          winner || (homeScore > awayScore ? match.home : homeScore < awayScore ? match.away : null);
        match.played = true;
        return updated;
      }

      if (updated.final.id === matchId) {
        const match = updated.final;
        match.homeScore = homeScore;
        match.awayScore = awayScore;
        match.winner =
          winner || (homeScore > awayScore ? match.home : homeScore < awayScore ? match.away : null);
        match.played = true;
        return updated;
      }

      return prev;
    });
  }, []);

  const setKnockoutTeams = useCallback((roundOf32Assignments) => {
    setKnockout((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));

      Object.entries(roundOf32Assignments).forEach(([matchId, team]) => {
        const idNum = parseInt(matchId, 10);
        const idx = updated.roundOf32.findIndex((m) => m.id === idNum);
        if (idx === -1) return;

        const match = updated.roundOf32[idx];

        if (Array.isArray(match.teams) && match.teams[0].toLowerCase().includes('third')) {
          match.home = team;
        } else {
          match.away = team;
        }

        match.played = false;
      });

      return updated;
    });
  }, []);

  // ---------- EXPORT / IMPORT ----------

  const exportResults = useCallback(() => {
    const rows = [];

    Object.values(groups).forEach((group) => {
      group.matches.forEach((match) => {
        if (!match.played) return;
        rows.push({
          Group: group.id,
          Match: match.id,
          Home: match.home.name,
          Away: match.away.name,
          HomeScore: match.homeScore,
          AwayScore: match.awayScore,
        });
      });
    });

    const csv = [
      ['Group', 'Match', 'Home', 'Away', 'Home Score', 'Away Score'].join(','),
      ...rows.map((r) =>
        [r.Group, r.Match, `"${r.Home}"`, `"${r.Away}"`, r.HomeScore, r.AwayScore].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'world-cup-2026-results.csv';
    a.click();
  }, [groups]);

  const importResults = useCallback(
    (csvText) => {
      resetAll();

      const lines = csvText.split('\n').slice(1);
      lines.forEach((line) => {
        if (!line.trim()) return;
        const [groupId, matchId, homeName, awayName, homeScore, awayScore] = line
          .split(',')
          .map((cell) => cell.replace(/"/g, '').trim());

        if (groupId && matchId) {
          updateGroupMatch(groupId, matchId, Number(homeScore), Number(awayScore));
        }
      });
    },
    [updateGroupMatch, resetAll]
  );

  // ---------- CONTEXT VALUE ----------

  const value = useMemo(
    () => ({
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
      setThirdPlaceTeams,
    }),
    [
      groups,
      knockout,
      thirdPlaceTeams,
      activeTab,
      updateGroupMatch,
      updateKnockoutMatch,
      calculateGroupStandings,
      setKnockoutTeams,
      resetAll,
      exportResults,
      importResults,
    ]
  );

  return (
    <SimulatorContext.Provider value={value}>{children}</SimulatorContext.Provider>
  );
};

export default SimulatorContext;
