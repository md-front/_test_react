import initialState from '../initialParams';
import {
    CHANGE_NEW,
    ADD_KEYWORD,
    CLEAR_KEYWORDS,
    DELETE_KEYWORD,
    FORM_SUBMIT,
} from '../types/form';


const formInitState = {
    name: initialState.name,
    necessary: initialState.necessary,
    unnecessary: initialState.unnecessary,
    newInDays: initialState.newInDays,
    experience: initialState.experience
};

const form = (state = formInitState, action) => {
    switch (action.type) {
        case FORM_SUBMIT:
            return {
                ...state,
                name: action.payload.name,
                experience: action.payload.experience,
            }
        case CHANGE_NEW:
            const newInDays = [...state.newInDays].map(option => {
                option.checked = option.value === action.value;

                return option;
            })
            return {
                ...state,
                newInDays
            }
        case ADD_KEYWORD:
            return {
                ...state,
                [action.keywordType]: [...state[action.keywordType], action.value]
            }
        case DELETE_KEYWORD:
            const keywordType = [...state[action.keywordType]].filter(keyword => keyword !== action.value);
            return {
                ...state,
                [action.keywordType]: keywordType
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
