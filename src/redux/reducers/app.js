import {appInitState} from '../initialParams';
import {
    SHOW_ALERT,
    HIDE_ALERT,
    ADD_TO_BLACKLIST,
    TOGGLE_FAVORITE,
    SHOW_LOADER,
    HIDE_LOADER,
} from '../types/app';

const app = (state = appInitState, action) => {
    switch (action.type) {
        case HIDE_ALERT:
            return {
                ...state,
                showAlert: false
            }
        case SHOW_ALERT:
            return {
                ...state,
                showAlert: true
            }
        case ADD_TO_BLACKLIST:
            return {
                ...state,
                blacklist: [...state.blacklist, action.vacancyId]
            }
        case TOGGLE_FAVORITE:
            return {
                ...state,
                favorites: [...action.favorites]
            }
        case SHOW_LOADER:
            return {
                ...state,
                showLoader: true
            }
        case HIDE_LOADER:
            return {
                ...state,
                showLoader: false
            }
        default:
            return state
    }
}

export default app
