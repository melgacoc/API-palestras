const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const talkersPath = path.join(__dirname, 'talker.json');

const talkers = async () => {
  const talkersInfo = await fs.readFile(talkersPath, 'utf-8');
  return JSON.parse(talkersInfo);
};
// utf-8 é pra aceitar caracteres especiais

const findTalkerId = async (id) => {
  const info = await talkers();
  const talkerId = info.find((talkerID) => talkerID.id === Number(id));
  return talkerId;
};

const tokenGen = () => {
  const token = crypto.randomBytes(8).toString('hex');
  return token;
};

const addTalker = async (name, age, talk) => {
  const talkersList = await talkers();
  const newTalker = {
    age,
    id: talkersList.length + 1,
    name,
    talk,
  };

  talkersList.push(newTalker);
  await fs.writeFile(talkersPath, JSON.stringify(talkersList));
  // writeFile sobrescreve
  return newTalker;
};

const attTalker = async (id, name, age, talk) => {
  const talkersList = await talkers();
  const talkerId = talkersList.find((talkerID) => talkerID.id === Number(id));
  const index = talkersList.indexOf(talkerId);
  talkersList[index] = {
    age,
    id: Number(id),
    name,
    talk,
  };
  await fs.writeFile(talkersPath, JSON.stringify(talkersList));
  return talkersList[index];
};

module.exports = {
  talkers,
  findTalkerId,
  tokenGen,
  addTalker,
  attTalker,
};
