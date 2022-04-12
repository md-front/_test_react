import { combineReducers } from 'redux';
import form from './form';
import regions from './regions';
import app from './app';

export default combineReducers({
  form,
  regions,
  app,
});
