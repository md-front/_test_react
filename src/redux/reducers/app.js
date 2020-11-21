import {appInitState} from '../initialParams';
import {
    SHOW_ALERT,
    HIDE_ALERT,
    ADD_TO_BLACKLIST,
    TOGGLE_FAVORITE,
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
        default:
            return state
    }
}

export default app
