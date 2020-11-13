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
    necessary: ['front', 'фронт', 'js', 'javascript', 'react'],
    unnecessary: ['backend', 'fullstack', 'SQL', 'lead', 'ведущий', 'angular'],
    newInDays: 1,
    regions: [
        {
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
        },
        {
            'id': 'ekb',
            'name': 'Екатеринбург',
            'location': 'area=3',
            checked: true,
        },
        {
            'id': 'remote',
            'name': 'Удалённые вакансии',
            'location': 'schedule=remote',
            checked: true,
        }
    ]
}

/* TODO вынести отдельно */
const SEARCH_PARAMS = (() => {
    let result = {};
    const urlParams = (new URL(document.location)).searchParams;

    if(!urlParams.toString())
        return DEFAULT_SEARCH_PARAMS;

    for(let param in DEFAULT_SEARCH_PARAMS) {
        let dataFromUrl = urlParams.get(param);
        let tempData;
        const isKeyword = param === 'necessary' || param === 'unnecessary';
        const needDefaultValue = param === 'newInDays' || param === 'regions' /* || param === 'name'*/
        const emptyValue = (()=> {

            if(needDefaultValue)
                return DEFAULT_SEARCH_PARAMS[param];

            if(isKeyword)
                return [];

            return ''
        })();

        if(dataFromUrl && isKeyword) {
            tempData = dataFromUrl.split(',');
        } else if(dataFromUrl && param === 'regions') {
            tempData = [...DEFAULT_SEARCH_PARAMS.regions];
            dataFromUrl = dataFromUrl.split(',');

            tempData.forEach(region => region.checked = dataFromUrl.includes(region.id))
        } else {
            tempData = dataFromUrl;
        }

        result[param] = tempData ? tempData : emptyValue;
    }

    return result;
})()

window.JUNIOR = new RegExp(/junior|стажер|младший/i);

ReactDOM.render(
  <React.StrictMode>
    <App defaultSearchParams={SEARCH_PARAMS} />
  </React.StrictMode>,
  document.getElementById('root')
);