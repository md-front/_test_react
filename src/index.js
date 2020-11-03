import React from 'react';
import ReactDOM from 'react-dom';
import './styles/style.css';
import App from './App';

/** Debug */
window.LOAD_ALL_DATA = true;

const REGIONS_PARAMS = [
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

window.GROUP_NAMES = {
    is_fav: 'Избранное',
    is_new: 'Новые',
    is_jun: 'Для начинающих',
    is_salary: 'С указанным окладом',
    default: 'Без дополнительных параметров',
}

window.NEW_IN_DAYS = 1;

window.NECESSARY = new RegExp(/front|фронт|js|javascript/i);
window.UNNECESSARY = new RegExp(/backend|fullstack|SQL|lead|ведущий|angular/i);
window.JUNIOR = new RegExp(/junior|стажер|младший/i);

ReactDOM.render(
  <React.StrictMode>
    <App regions={REGIONS_PARAMS } />
  </React.StrictMode>,
  document.getElementById('root')
);