import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import rootReducer from './redux/reducers';
// import {createLogger} from 'redux-logger';
import { setLS } from './helpers';
import App from './App';
import './styles/style.scss';
import { BaseFormFields } from './types/initialParams.types';

export const IS_LOCAL_DATA = process.env.NODE_ENV === 'development';

const composeEnhancers = composeWithDevTools({
  trace: true,
  traceLimit: 25,
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
    applyMiddleware(...middlewares),
  ),
);

store.subscribe(() => {
  const {
    app: {
      favorites,
      blacklist,
      hiddenGroups,
      imprintFav,
      minSalary,
    },
  } = store.getState();

  setLS(BaseFormFields.favorites, favorites);
  setLS(BaseFormFields.blacklist, blacklist);
  setLS(BaseFormFields.hiddenGroups, hiddenGroups);
  setLS(BaseFormFields.imprintFav, imprintFav);
  setLS(BaseFormFields.minSalary, minSalary);
  setLS('lastTimeDaysAgo', new Date());
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
