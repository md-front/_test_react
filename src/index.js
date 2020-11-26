import React from 'react';
import ReactDOM from 'react-dom';
import rootReducer from './redux/reducers';
import {createStore, applyMiddleware} from "redux";
import thunk from 'redux-thunk'
import {Provider} from "react-redux";
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';
// import {createLogger} from 'redux-logger';
import {setLS} from './helpers';
import App from './App';
import './styles/style.css';

const composeEnhancers = composeWithDevTools({
    trace: true,
    traceLimit: 25
});

const middlewares = [thunk];

// if(process.env.NODE_ENV === 'development')
//     middlewares.push(createLogger({
//         collapsed: true,
//         diff: true
//     }))

const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(...middlewares)
    )
);

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