import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// debug
window.LOAD_ALL_DATA = true;

window.LOCATION_PARAMS = [
    {
        'id': 'ekb',
        'name': 'Екатеринбург',
        'location': 'area=3',
    },
    /*{
        'id': 'remote',
        'name': 'Удалённо',
        'location': 'schedule=remote'
    },*/
]

// Регулярки имени вакансии
window.NEW_IN_DAYS = 1;
window.NECESSARY = new RegExp(/front|фронт|js|javascript/i);
window.UNNECESSARY = new RegExp(/backend|fullstack|SQL|lead|ведущий|angular/i);
window.JUNIOR = new RegExp(/junior|стажер|младший/i);
window.COMPANY_BLACKLIST = ['4932875','46587']; /* TODO забивается руками */

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);