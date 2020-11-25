import {formInitState} from '../initialParams';
import {
    CHANGE_NEW_IN_DAYS,
    CHANGE_KEYWORDS,
    CLEAR_KEYWORDS,
    FORM_SUBMIT,
} from '../types/form';
import {cloneObj} from "../../helpers";

const form = (state = formInitState, action) => {
    switch (action.type) {
        case FORM_SUBMIT:
            return {
                ...state,
                name: action.name,
                experience: cloneObj(action.experience),
            }
        case CHANGE_NEW_IN_DAYS:
            return {
                ...state,
                newInDays: action.newInDays
            }
        case CHANGE_KEYWORDS:
            return {
                ...state,
                [action.keywordType]: action.keywords
            }
        case CLEAR_KEYWORDS:
            return {
                ...state,
                necessary: [],
                unnecessary: [],
            }
        default:
            return state
    }
}

export default form
