import * as types from '../types/app'
import {filterVacancies} from './regions'

export const showAlert = (e) => dispatch => {
    e.stopPropagation();
    dispatch({ type: types.SHOW_ALERT });
};

export const hideAlert = () => ({ type: types.HIDE_ALERT });

export const loadUsdCurrency = () => async dispatch => {
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    const data = await response.json();
    const value = data.Valute.USD.Value

    dispatch({ type: types.SET_USD_CURRENCY, value });
};
export const clearUsdCurrency = () => ({ type: types.CLEAR_USD_CURRENCY });

export const showLoader = () => ({ type: types.SHOW_LOADER });
export const hideLoader = () => ({ type: types.HIDE_LOADER });

export const clearList = listType => (dispatch, getState) => {
    const {regions} = getState();
    const currentSection = regions.find(section => section.is_active)

    dispatch({ type: types.CLEAR_LIST, listType })
    dispatch(filterVacancies(currentSection.allVacancies))
};

export const addToBlacklist = (e, vacancy) => (dispatch, getState) => {
    e.preventDefault();
    const {regions} = getState();
    const currentSection = regions.find(section => section.is_active);

    // vacancy.is_del = true;

    dispatch({ type: types.ADD_TO_BLACKLIST, vacancyId: vacancy.id });
    dispatch(filterVacancies(currentSection.vacancies, false, false))
};

export const toggleFavorite = (companyId) => (dispatch, getState) => {
    const {regions, app} = getState();
    const currentSection = regions.find(section => section.is_active);

    let favorites = [...app.favorites];
    const indexOfCompany = favorites.indexOf(companyId);

    if(indexOfCompany !== -1)
        favorites.splice(indexOfCompany, 1);
    else
        favorites.push(companyId);

    dispatch({ type: types.TOGGLE_FAVORITE, favorites });
    dispatch(filterVacancies(currentSection.vacancies, false, false))
};

export const updateGroupsVisibility = (sectionId, groupId, isHidden) => (dispatch, getState) => {
    const {hiddenGroups} = getState().app;
    let group = hiddenGroups[sectionId];

    if(isHidden)
        group.push(groupId)
    else
        hiddenGroups[sectionId] = group.filter(hiddenGroupId => hiddenGroupId === groupId)

    dispatch({ type: types.UPDATE_GROUPS_VISIBILITY, hiddenGroups });
}