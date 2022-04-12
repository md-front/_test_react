import { regionsInitState } from '../initialParams';
import {
  UPDATE_DATA,
} from '../types/regions';

// eslint-disable-next-line default-param-last
const app = (state = regionsInitState, action) => {
  switch (action.type) {
    case UPDATE_DATA:
      return [...action.regions];
    default:
      return state;
  }
};

export default app;
