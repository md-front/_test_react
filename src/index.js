import React from 'react';
import ReactDOM from 'react-dom';
import rootReducer from './redux/reducers';
import {compose, createStore, applyMiddleware} from "redux";
import thunk from 'redux-thunk'
import {Provider} from "react-redux";
import {setLS} from './helpers';
import App from './App';
import './styles/style.css';

const middlewares = [applyMiddleware(thunk)];

if(process.env.NODE_ENV === 'development')
    middlewares.push(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__());

const store = createStore(rootReducer, compose(...middlewares));

store.subscribe(() => {
    const app = store.getState().app;

    setLS('favorites', app.favorites);
    setLS('blacklist', app.blacklist);
})

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root'));