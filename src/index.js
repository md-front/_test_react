import React from 'react';
import ReactDOM from 'react-dom';
import './styles/style.css';
import App from './App';
import {searchParams} from './initialParams';

/** Debug */
window.LOAD_ALL_DATA = false;

window.GROUP_NAMES = {
    is_fav: 'Избранное',
    is_new: 'Новые',
    is_jun: 'Для начинающих',
    is_salary: 'С указанным окладом',
    default: 'Без дополнительных параметров',
}

window.JUNIOR = new RegExp(/junior|стажер|младший/i);

ReactDOM.render(
  <React.StrictMode>
    <App defaultSearchParams={searchParams} />
  </React.StrictMode>,
  document.getElementById('root')
);