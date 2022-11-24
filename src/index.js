const express = require('express');
const bodyParser = require('body-parser');
const { talkers,
  findTalkerId,
  tokenGen,
  addTalker,
  attTalker,
  removeTalker } = require('./helpers');
const { emailVerify,
  passwordVerify,
  tokenVerify,
  nameVerify,
  ageVerify,
  talkFieldVerify,
  rateVerify,
  watchedAtVerify } = require('./middlewares');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar a
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const response = await talkers();
  res.status(200).json(response);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const response = await findTalkerId(id);
  if (!response) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  res.status(200).json(response);
});

app.post('/login', emailVerify, passwordVerify, (_req, res) =>
  res.status(200).json({ token: tokenGen() }));

app.post('/talker',
tokenVerify,
nameVerify,
ageVerify,
talkFieldVerify,
rateVerify,
watchedAtVerify, async (req, res) => {
  const { name, age, talk } = req.body;
  const newTalker = await addTalker(name, age, talk);
  res.status(201).json(newTalker);
});

app.put('/talker/:id',
tokenVerify,
nameVerify,
ageVerify,
talkFieldVerify,
rateVerify,
watchedAtVerify, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const attTalkerInfos = await attTalker(id, name, age, talk);
  res.status(200).json(attTalkerInfos);
});

app.delete('/talker/:id', tokenVerify, async (req, res) => {
  const { id } = req.params;
  await removeTalker(id);
  res.status(204).end();
});

app.get('/talker/search', tokenVerify, async (req, res) => {
  const { q } = req.query;
  const talkersList = talkers();
  const searchTalker = talkersList.filter((talker) =>
    talker.name.toLowerCase().includes(q.toLocaleLowerCase()));
  res.status(200).json(searchTalker);
});

app.listen(PORT, () => {
  console.log('Online');
});
