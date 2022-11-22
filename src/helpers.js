const fs = require('fs').promises;
const path = require('path');

const talkersPath = path.join(__dirname, 'talker.json');

const talkers = async () => {
  const talkersInfo = await fs.readFile(talkersPath, 'utf-8');
  return JSON.parse(talkersInfo);
};

module.exports = {
  talkers,
};
