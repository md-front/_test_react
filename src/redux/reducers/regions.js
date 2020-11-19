import initialState from '../initialParams';
import {
    UPDATE_DATA,
} from '../types/regions';

const appInitState = [...initialState.regions];

const app = (state = appInitState, action) => {
    switch (action.type) {
        case UPDATE_DATA:
            return [
                ...action.regions
            ]
        default:
            return state
    }
}

export default app
