import React from 'react';
import ReactDOM from 'react-dom';
import './styles/style.css';
import DEFAULT_SEARCH_PARAMS from './initialParams';
import rootReducer from './redux/reducers';
import {createStore} from "redux";
import {Provider} from "react-redux";
import App from './App';

/** Debug */
window.LOAD_ALL_DATA = true;

const searchParams = (() => {
    let result = {};
    const urlParams = (new URL(document.location)).searchParams;

    if(!urlParams.toString())
        return DEFAULT_SEARCH_PARAMS;

    for(let param in DEFAULT_SEARCH_PARAMS) {
        let dataFromUrl = urlParams.get(param);
        let tempData;
        const isKeyword = param === 'necessary' || param === 'unnecessary';
        const needDefaultValue = param === 'newInDays' || param === 'regions' || param === 'experience' /* || param === 'name'*/
        const emptyValue = (()=> {

            if(needDefaultValue)
                return DEFAULT_SEARCH_PARAMS[param];

            if(isKeyword)
                return [];

            return ''
        })();

        if(dataFromUrl && isKeyword) {
            tempData = dataFromUrl.split(',');
        }
        if(dataFromUrl && (param === 'regions' || param === 'experience')) {
            tempData = [...DEFAULT_SEARCH_PARAMS[param]];
            dataFromUrl = dataFromUrl.split(',');

            tempData.forEach(item => item.checked = dataFromUrl.includes(item.id))
        } else {
            tempData = dataFromUrl;
        }

        result[param] = tempData ? tempData : emptyValue;
    }

    return result;
})()

window.GROUP_NAMES = {
    is_fav: 'Избранное',
    is_new: 'Новые',
    exp6: 'Опыт > 6 лет',
    exp3: 'Опыт 3-6 лет',
    is_jun: 'Для начинающих',
    is_salary: 'С указанным окладом',
    default: 'Опыт 1-3 года',
}

window.JUNIOR = new RegExp(/junior|стажер|младший|помощник/i);

const store = createStore(rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const app = (
    <Provider store={store}>
        <App defaultSearchParams={searchParams} />
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'));