import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// debug
window.LOAD_REMOTE = true;
window.LOAD_ALL_DATA = false;
// const LOAD_ALL_DATA = false;

window.PARAMS = [
    {
        'id': 'ekb',
        'name': 'Екатеринбург',
        'location': 'area=3',
    },
    {
        'id': 'remote',
        'name': 'Удалённо',
        'location': 'schedule=remote'
    },
]

// Регулярки имени вакансии
window.NEW_IN_DAYS = 1;
window.NECESSARY = new RegExp(/front|фронт|js|javascript/i);
window.UNNECESSARY = new RegExp(/backend|fullstack|SQL|lead|ведущий|angular/i);
window.JUNIOR = new RegExp(/junior|стажер|младший/i);
window.COMPANY_BLACKLIST = ['4932875','46587']; /* TODO забивается руками */

window.VALID_NEW_DATE = new Date(new Date() - (window.NEW_IN_DAYS * 24 * 60 * 60 * 1000));

window.setLS = (key, payload) => localStorage.setItem(key, JSON.stringify(payload));
window.getLS = (key) => JSON.parse(localStorage.getItem(key)) || {};

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);