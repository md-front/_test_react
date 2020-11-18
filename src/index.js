import React from 'react';
import ReactDOM from 'react-dom';
import './styles/style.css';
import {searchParams} from './initialParams';
import {rootReducer} from './redux/rootReducer';
import {createStore} from "redux";
import {Provider} from "react-redux";
import App from './App';

/** Debug */
window.LOAD_ALL_DATA = true;

window.GROUP_NAMES = {
    is_fav: 'Избранное',
    is_new: 'Новые',
    exp6: 'Более 6 лет',
    exp3: '3-6 лет',
    is_jun: 'Для начинающих',
    is_salary: 'С указанным окладом',
    default: 'Без дополнительных параметров',
}

window.JUNIOR = new RegExp(/junior|стажер|младший/i);


const store = createStore(rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const app = (
    <Provider store={store}>
        <App defaultSearchParams={searchParams} />
    </Provider>
)

/* TODO ! завелось? */
ReactDOM.render(app, document.getElementById('root'));


/* TODO ! redux */
const DEFAULT_PARAMS = {
    name: 'Frontend',
    necessary: ['front', 'фронт', 'js', 'javascript', 'react'],
    unnecessary: ['backend', 'fullstack', 'SQL', 'lead', 'ведущий', 'angular'],
    newInDays: 1,
    experience: [
        {
            'id': 'noExperience',
            'name': 'Нет опыта',
            'checked': true,
        },
        {
            'id': 'between1And3',
            'name': 'От 1 года до 3 лет',
            'checked': true,
        },
        {
            'id': 'between3And6',
            'name': 'От 3 до 6 лет',
            'checked': false,
        },
        {
            'id': 'moreThan6',
            'name': 'Более 6 лет',
            'checked': false,
        }
    ],
    regions: [
        {
            'id': 'msk',
            'name': 'Москва',
            'location': 'area=1',
            'checked': false,
        },
        {
            'id': 'spb',
            'name': 'Санкт-Петербург',
            'location': 'area=2',
            'checked': false,
        },
        {
            'id': 'ekb',
            'name': 'Екатеринбург',
            'location': 'area=3',
            'checked': true,
        },
        {
            'id': 'remote',
            'name': 'Удалённая работа',
            'location': 'schedule=remote',
            'checked': true,
        }
    ],
    // showMore: false,

}