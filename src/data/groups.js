export const groups = {
  A: ["Mexico", "South Africa", "Korea Republic", "Winner Play-Off D"],
  B: ["Canada", "Winner Play-Off A", "Qatar", "Switzerland"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["USA", "Paraguay", "Australia", "Winner Play-Off C"],
  E: ["Germany", "Curaçao", "Côte d'Ivoire", "Ecuador"],
  F: ["Netherlands", "Japan", "Winner Play-Off B", "Tunisia"],
  G: ["Belgium", "Egypt", "IR Iran", "New Zealand"],
  H: ["Spain", "Cabo Verde", "Saudi Arabia", "Uruguay"],
  I: ["France", "Senegal", "Winner Play-Off 2", "Norway"],
  J: ["Argentina", "Algeria", "Austria", "Jordan"],
  K: ["Portugal", "Winner Play-Off 1", "Uzbekistan", "Colombia"],
  L: ["England", "Croatia", "Ghana", "Panama"]
};

// Generate all possible matches within each group - ALL EMPTY SCORES
export const generateGroupMatches = () => {
  const allMatches = {};
  
  Object.keys(groups).forEach(groupName => {
    const teams = groups[groupName];
    const matches = [];
    
    // Generate round-robin matches
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matches.push({
          id: `${groupName}-${teams[i]}-${teams[j]}`,
          group: groupName,
          home: teams[i],
          away: teams[j],
          homeScore: null, // EMPTY - no pre-filled 0-0
          awayScore: null, // EMPTY - no pre-filled 0-0
          played: false
        });
      }
    }
    
    allMatches[groupName] = matches;
  });
  
  return allMatches;
};