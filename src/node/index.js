const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync(path.join(path.resolve(), '/src/node/data/data.json'), 'utf-8'));

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Таблица
app.get('/api/data', cors(null, { origin: true }), (req, res) => {
  res.send(data);
});

app.listen(5000, () => console.log('Сервер создан'));
