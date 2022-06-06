const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync(path.join(path.resolve(), '/src/node/data/data.json'), 'utf-8'));

const app = express();

const defaultCors = cors(null, { origin: true });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Таблица
app.get('/api/data', defaultCors, (req, res) => res.send(data));

// Инфа по 1 вакансии
app.get('/api/vacancies/:vacancy', defaultCors, (req, res) => {
  const Vacancy = JSON.parse(
    fs.readFileSync(
      path.join(
        path.resolve(),
        `/src/node/data/vacancies/${req.params.vacancy}.json`,
      ),
      'utf-8',
    ),
  );

  res.send(Vacancy);
});

// eslint-disable-next-line no-console
app.listen(5000, () => console.log('Сервер создан'));
