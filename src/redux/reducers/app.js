import { appInitState } from '../initialParams';
import {
  SHOW_ALERT,
  HIDE_ALERT,
  ADD_TO_BLACKLIST,
  TOGGLE_FAVORITE,
  SHOW_LOADER,
  HIDE_LOADER,
  CLEAR_LIST,
  SET_USD_CURRENCY,
  CLEAR_USD_CURRENCY,
  UPDATE_GROUPS_VISIBILITY,
  TOGGLE_ARCHIVED,
  IMPRINT_FAVORITE,
} from '../types/app';

// eslint-disable-next-line default-param-last
const app = (state = appInitState, action) => {
  switch (action.type) {
    case HIDE_ALERT:
      return {
        ...state,
        showAlert: false,
      };
    case SHOW_ALERT:
      return {
        ...state,
        showAlert: true,
      };
    case ADD_TO_BLACKLIST:
      return {
        ...state,
        blacklist: [...state.blacklist, action.vacancyId],
      };
    case TOGGLE_FAVORITE:
      return {
        ...state,
        favorites: [...action.favorites],
      };
    case SHOW_LOADER:
      return {
        ...state,
        showLoader: true,
      };
    case HIDE_LOADER:
      return {
        ...state,
        showLoader: false,
      };
    case CLEAR_LIST:
      return {
        ...state,
        [action.listType]: [],
      };
    case SET_USD_CURRENCY:
      return {
        ...state,
        usdCurrency: action.value,
      };
    case CLEAR_USD_CURRENCY:
      return {
        ...state,
        usdCurrency: null,
      };
    case UPDATE_GROUPS_VISIBILITY:
      return {
        ...state,
        hiddenGroups: action.hiddenGroups,
      };
    case TOGGLE_ARCHIVED:
      return {
        ...state,
        showArchived: action.showArchived,
      };
    case IMPRINT_FAVORITE:
      return {
        ...state,
        imprintFav: [...action.imprintFav],
      };
    default:
      return state;
  }
};

export default app;
