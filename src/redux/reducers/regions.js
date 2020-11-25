import {regionsInitState} from '../initialParams';
import {
    UPDATE_DATA,
} from '../types/regions';
import {cloneObj} from "../../helpers";

const app = (state = regionsInitState, action) => {
    switch (action.type) {
        case UPDATE_DATA:
            // return cloneObj(action.regions)
            return [...action.regions]
        default:
            return state
    }
}

export default app
