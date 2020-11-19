import * as types from '../types/form'

export const formSubmit = payload => ({ type: types.FORM_SUBMIT, payload })
export const changeNew = value => ({ type: types.CHANGE_NEW, value })
export const addKeyword = (keywordType, value) => ({ type: types.ADD_KEYWORD, keywordType, value })
export const deleteKeyword = (keywordType, value) => ({ type: types.DELETE_KEYWORD, keywordType, value })
export const clearKeywords = () => ({ type: types.CLEAR_KEYWORDS })