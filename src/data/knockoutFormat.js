export const knockoutFormat = {
  roundOf32: [
    {
      id: 73,
      name: "Match 73",
      teams: ["Group A runners-up", "Group B runners-up"],
      stadium: "Los Angeles Stadium",
      winnerAdvancesTo: 90,
      groupRequirements: ["A", "B"]
    },
    {
      id: 74,
      name: "Match 74",
      teams: ["Group E winners", "Group A/B/C/D/F third place"],
      stadium: "Boston Stadium",
      winnerAdvancesTo: 89,
      groupRequirements: ["E", ["A", "B", "C", "D", "F"]]
    },
    {
      id: 75,
      name: "Match 75",
      teams: ["Group F winners", "Group C runners-up"],
      stadium: "Estadio Monterrey",
      winnerAdvancesTo: 90,
      groupRequirements: ["F", "C"]
    },
    {
      id: 76,
      name: "Match 76",
      teams: ["Group C winners", "Group F runners-up"],
      stadium: "Houston Stadium",
      winnerAdvancesTo: 91,
      groupRequirements: ["C", "F"]
    },
    {
      id: 77,
      name: "Match 77",
      teams: ["Group I winners", "Group C/D/F/G/H third place"],
      stadium: "New York New Jersey Stadium",
      winnerAdvancesTo: 89,
      groupRequirements: ["I", ["C", "D", "F", "G", "H"]]
    },
    {
      id: 78,
      name: "Match 78",
      teams: ["Group E runners up", "Group I runners-up"],
      stadium: "Dallas Stadium",
      winnerAdvancesTo: 91,
      groupRequirements: ["E", "I"]
    },
    {
      id: 79,
      name: "Match 79",
      teams: ["Group A winners", "Group C/E/F/H/I third place"],
      stadium: "Mexico City Stadium",
      winnerAdvancesTo: 92,
      groupRequirements: ["A", ["C", "E", "F", "H", "I"]]
    },
    {
      id: 80,
      name: "Match 80",
      teams: ["Group L winners", "Group E/H/I/J/K third place"],
      stadium: "Atlanta Stadium",
      winnerAdvancesTo: 92,
      groupRequirements: ["L", ["E", "H", "I", "J", "K"]]
    },
    {
      id: 81,
      name: "Match 81",
      teams: ["Group D winners", "Group B/E/F/I/J third place"],
      stadium: "San Francisco Bay Area Stadium",
      winnerAdvancesTo: 93,
      groupRequirements: ["D", ["B", "E", "F", "I", "J"]]
    },
    {
      id: 82,
      name: "Match 82",
      teams: ["Group G winners", "Group A/E/H/I/J third place"],
      stadium: "Seattle Stadium",
      winnerAdvancesTo: 94,
      groupRequirements: ["G", ["A", "E", "H", "I", "J"]]
    },
    {
      id: 83,
      name: "Match 83",
      teams: ["Group K runners-up", "Group L runners-up"],
      stadium: "Toronto Stadium",
      winnerAdvancesTo: 94,
      groupRequirements: ["K", "L"]
    },
    {
      id: 84,
      name: "Match 84",
      teams: ["Group H winners", "Group J runners-up"],
      stadium: "Los Angeles Stadium",
      winnerAdvancesTo: 93,
      groupRequirements: ["H", "J"]
    },
    {
      id: 85,
      name: "Match 85",
      teams: ["Group B winners", "Group E/F/G/I/J third place"],
      stadium: "BC Place Vancouver",
      winnerAdvancesTo: 96,
      groupRequirements: ["B", ["E", "F", "G", "I", "J"]]
    },
    {
      id: 86,
      name: "Match 86",
      teams: ["Group J winners", "Group H runners-up"],
      stadium: "Miami Stadium",
      winnerAdvancesTo: 95,
      groupRequirements: ["J", "H"]
    },
    {
      id: 87,
      name: "Match 87",
      teams: ["Group K winners", "Group D/E/I/J/L third place"],
      stadium: "Kansas City Stadium",
      winnerAdvancesTo: 96,
      groupRequirements: ["K", ["D", "E", "I", "J", "L"]]
    },
    {
      id: 88,
      name: "Match 88",
      teams: ["Group D runners-up", "Group G runners-up"],
      stadium: "Dallas Stadium",
      winnerAdvancesTo: 95,
      groupRequirements: ["D", "G"]
    }
  ],

  roundOf16: [
    { id: 89, name: "Match 89", teams: ["Winner match 74", "Winner match 77"], stadium: "Philadelphia Stadium", winnerAdvancesTo: 97 },
    { id: 90, name: "Match 90", teams: ["Winner match 73", "Winner match 75"], stadium: "Houston Stadium", winnerAdvancesTo: 97 },
    { id: 91, name: "Match 91", teams: ["Winner match 76", "Winner match 78"], stadium: "New York New Jersey Stadium", winnerAdvancesTo: 99 },
    { id: 92, name: "Match 92", teams: ["Winner match 79", "Winner match 80"], stadium: "Mexico City Stadium", winnerAdvancesTo: 99 },
    { id: 93, name: "Match 93", teams: ["Winner match 81", "Winner match 84"], stadium: "Los Angeles Stadium", winnerAdvancesTo: 98 },
    { id: 94, name: "Match 94", teams: ["Winner match 82", "Winner match 83"], stadium: "Los Angeles Stadium", winnerAdvancesTo: 98 },
    { id: 95, name: "Match 95", teams: ["Winner match 86", "Winner match 88"], stadium: "Atlanta Stadium", winnerAdvancesTo: 100 },
    { id: 96, name: "Match 96", teams: ["Winner match 85", "Winner match 87"], stadium: "BC Place Vancouver", winnerAdvancesTo: 100 }
  ],

  quarterFinals: [
    { id: 97, name: "Match 97", teams: ["Winner match 89", "Winner match 90"], stadium: "Boston Stadium", winnerAdvancesTo: 101 },
    { id: 98, name: "Match 98", teams: ["Winner match 93", "Winner match 94"], stadium: "Los Angeles Stadium", winnerAdvancesTo: 101 },
    { id: 99, name: "Match 99", teams: ["Winner match 91", "Winner match 92"], stadium: "Miami Stadium", winnerAdvancesTo: 102 },
    { id: 100, name: "Match 100", teams: ["Winner match 95", "Winner match 96"], stadium: "Kansas City Stadium", winnerAdvancesTo: 102 }
  ],

  semiFinals: [
    { id: 101, name: "Match 101", teams: ["Winner match 97", "Winner match 98"], stadium: "Dallas Stadium", winnerAdvancesTo: 104 },
    { id: 102, name: "Match 102", teams: ["Winner match 99", "Winner match 100"], stadium: "Atlanta Stadium", winnerAdvancesTo: 104 }
  ],

  thirdPlace: {
    id: 103,
    name: "Match 103",
    teams: ["Loser match 101", "Loser match 102"],
    stadium: "Miami Stadium"
  },

  final: {
    id: 104,
    name: "Match 104",
    teams: ["Winner match 101", "Winner match 102"],
    stadium: "New York New Jersey Stadium"
  }
};
