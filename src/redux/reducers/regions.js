import {regionsInitState} from '../initialParams';
import {
    UPDATE_DATA,
} from '../types/regions';

const app = (state = regionsInitState, action) => {
    switch (action.type) {
        case UPDATE_DATA:
            return [...action.regions]
        default:
            return state
    }
}

export default app
