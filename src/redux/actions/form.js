import * as types from '../types/form'
import {changeSelectedRegions, filterVacancies} from  './regions'

export const formSubmit = ({name, experience, regions}) => dispatch => {
    dispatch({ type: types.FORM_SUBMIT, payload: {name, experience} })
    dispatch(changeSelectedRegions(regions))
}
export const changeNewInDays = value => (dispatch, getState) => {
    const newInDays = [...getState().form.newInDays].map(option => {
        option.checked = option.value === value;

        return option;
    })
    dispatch({ type: types.CHANGE_NEW_IN_DAYS, newInDays });
    dispatch(filterVacancies());
}
export const addKeyword = (keywordType, value) => (dispatch, getState) => {
    const keywords = [...getState().form[keywordType], value]

    dispatch({ type: types.CHANGE_KEYWORDS, keywordType, keywords });
    dispatch(filterVacancies());
}
export const deleteKeyword = (keywordType, value) => (dispatch, getState) => {
    const keywords = [...getState().form[keywordType]].filter(keyword => keyword !== value);

    dispatch({ type: types.CHANGE_KEYWORDS, keywordType, keywords });
    dispatch(filterVacancies());
}
export const clearKeywords = () => dispatch => {

    dispatch({ type: types.CLEAR_KEYWORDS })
    dispatch(filterVacancies())
}