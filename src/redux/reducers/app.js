import { appInitState } from '../initialParams';
import {
  SHOW_ALERT,
  HIDE_ALERT,
  ADD_TO_BLACKLIST,
  TOGGLE_FAVORITE,
  LOADING,
  HIDE_LOADER,
  CLEAR_LIST,
  SET_USD_CURRENCY,
  UPDATE_GROUPS_VISIBILITY,
  TOGGLE_VISIBILITY_ARCHIVED,
  TOGGLE_HAVE_ARCHIVED,
  IMPRINT_FAVORITE,
  TOGGLE_SALARY_ONLY,
  CHANGE_MIN_SALARY,
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
    case LOADING:
      return {
        ...state,
        loading: action.progress,
      };
    case HIDE_LOADER:
      return {
        ...state,
        loading: 100,
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
    case UPDATE_GROUPS_VISIBILITY:
      return {
        ...state,
        hiddenGroups: action.hiddenGroups,
      };
    case TOGGLE_HAVE_ARCHIVED:
      return {
        ...state,
        haveArchived: action.haveArchived,
      };
    case TOGGLE_VISIBILITY_ARCHIVED:
      return {
        ...state,
        showArchived: action.showArchived,
      };
    case IMPRINT_FAVORITE:
      return {
        ...state,
        imprintFav: [...action.imprintFav],
      };
    case CHANGE_MIN_SALARY:
      return {
        ...state,
        minSalary: action.minSalary,
      };
    case TOGGLE_SALARY_ONLY:
      return {
        ...state,
        isSalaryOnly: !state.isSalaryOnly,
      };
    default:
      return state;
  }
};

export default app;
