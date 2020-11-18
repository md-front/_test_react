import DEFAULT_SEARCH_PARAMS from '../../initialParams';
import {
    CHANGE_NEW,
    ADD_KEYWORD,
    CLEAR_KEYWORDS,
    DELETE_KEYWORD,
} from '../types/form';

/* TODO react router */
const initialState = (() => {
    let result = {};
    const urlParams = (new URL(document.location)).searchParams;

    if(!urlParams.toString())
        return DEFAULT_SEARCH_PARAMS;

    for(let param in DEFAULT_SEARCH_PARAMS) {
        let dataFromUrl = urlParams.get(param);
        let tempData;
        const isKeyword = param === 'necessary' || param === 'unnecessary';
        const needDefaultValue = param === 'newInDays' || param === 'regions' || param === 'experience' /* || param === 'name'*/
        const emptyValue = (()=> {

            if(needDefaultValue)
                return DEFAULT_SEARCH_PARAMS[param];

            if(isKeyword)
                return [];

            return ''
        })();

        if(dataFromUrl && isKeyword) {
            tempData = dataFromUrl.split(',');
        } else if(dataFromUrl && (param === 'regions' || param === 'experience')) {
            tempData = [...DEFAULT_SEARCH_PARAMS[param]];
            dataFromUrl = dataFromUrl.split(',');

            tempData.forEach(item => item.checked = dataFromUrl.includes(item.id))
        } else {
            tempData = dataFromUrl;
        }

        result[param] = tempData ? tempData : emptyValue;
    }

    return result;
})()

const form = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_NEW:
            return {
                ...state,
                newInDays: action.value
            }
        case ADD_KEYWORD:
            return {
                ...state,
                [action.keywordType]: [...state[action.keywordType], action.value]
            }
        case DELETE_KEYWORD:
            const result = [...state[action.keywordType]].filter(keyword => keyword !== action.value);
            return {
                ...state,
                [action.keywordType]: result
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
