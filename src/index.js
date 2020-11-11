import React from 'react';
import ReactDOM from 'react-dom';
import './styles/style.css';
import App from './App';

/** Debug */
window.LOAD_ALL_DATA = false;

window.GROUP_NAMES = {
    is_fav: 'Избранное',
    is_new: 'Новые',
    is_jun: 'Для начинающих',
    is_salary: 'С указанным окладом',
    default: 'Без дополнительных параметров',
}

const DEFAULT_SEARCH_PARAMS = {
    name: 'Frontend',
    necessary: 'front, фронт, js, javascript, react',
    unnecessary: 'backend, fullstack, SQL, lead, ведущий, angular',
    regions: [
        /*{
            'id': 'msk',
            'name': 'Москва',
            'location': 'area=1',
            checked: false,
        },
        {
            'id': 'spb',
            'name': 'Санкт-Петербург',
            'location': 'area=2',
            checked: false,
        },*/
        {
            'id': 'ekb',
            'name': 'Екатеринбург',
            'location': 'area=3',
            checked: true,
        },
        {
            'id': 'remote',
            'name': 'Удалённо',
            'location': 'schedule=remote',
            checked: false,
        }
    ]
}

window.NEW_IN_DAYS = 1;

// window.NECESSARY = new RegExp(/front|фронт|js|javascript/i);
// window.UNNECESSARY = new RegExp(/backend|fullstack|SQL|lead|ведущий|angular/i);
window.JUNIOR = new RegExp(/junior|стажер|младший/i);

ReactDOM.render(
  <React.StrictMode>
    <App defaultSearchParams={DEFAULT_SEARCH_PARAMS} />
  </React.StrictMode>,
  document.getElementById('root')
);