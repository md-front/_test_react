import {appInitState} from '../initialParams';
import {
    SHOW_ALERT,
    HIDE_ALERT,
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
        default:
            return state
    }
}

export default app
