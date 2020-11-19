import React from 'react';
import ReactDOM from 'react-dom';
import './styles/style.css';
import rootReducer from './redux/reducers';
import {compose, createStore, applyMiddleware} from "redux";
import thunk from 'redux-thunk'
import {Provider} from "react-redux";
import App from './App';

/** Debug */
window.LOAD_ALL_DATA = false;

window.JUNIOR = new RegExp(/junior|стажер|младший|помощник/i);

const store = createStore(rootReducer, compose(
    applyMiddleware(
        thunk
    ),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

const app = (
    <Provider store={store}>
        <App />
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'));