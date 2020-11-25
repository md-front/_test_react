import React from 'react';
import ReactDOM from 'react-dom';
import './styles/style.css';
import rootReducer from './redux/reducers';
import {setLS} from './helpers';
import {compose, createStore, applyMiddleware} from "redux";
import thunk from 'redux-thunk'
import {Provider} from "react-redux";
import App from './App';

/** Debug */
window.LOAD_ALL_DATA = true;

const middlewares = [applyMiddleware(thunk)];

if(process.env.NODE_ENV === 'development')
    middlewares.push(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__());

const store = createStore(rootReducer, compose(...middlewares));

store.subscribe(() => {
    const app = store.getState().app;

    setLS('favorites', app.favorites);
    setLS('blacklist', app.blacklist);
})

const app = (
    <Provider store={store}>
        <App />
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'));