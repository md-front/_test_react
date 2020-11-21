import * as types from '../types/app'
import {filterVacancies} from '../actions/regions'

export const showAlert = (e) => dispatch => {
    e.stopPropagation();
    dispatch({ type: types.SHOW_ALERT });
};

export const hideAlert = () => ({ type: types.HIDE_ALERT });

export const addToBlacklist = (e, vacancyId) => (dispatch, getState) => {
    e.preventDefault();
    const {regions} = getState();
    const currentSection = regions.find(section => section.is_active);

    dispatch({ type: types.ADD_TO_BLACKLIST, vacancyId });
    dispatch(filterVacancies(currentSection.vacancies, false, false))
};

export const toggleFavorite = (companyId) => (dispatch, getState) => {
    console.log('companyId',companyId)
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