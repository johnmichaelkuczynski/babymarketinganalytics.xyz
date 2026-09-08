const { searchVoices } = require('@replit/agent-protocol');
searchVoices({ search: "warm narrator", pageSize: 1 })
  .then(console.log)
  .catch(console.error);
