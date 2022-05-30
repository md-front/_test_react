import * as types from '../types/app';
import { filterVacancies, visibleVacanciesUpdate } from './regions';
import { cloneObj } from '../../helpers';

export const showAlert = (e) => (dispatch) => {
  e.stopPropagation();
  dispatch({ type: types.SHOW_ALERT });
};

export const hideAlert = () => ({ type: types.HIDE_ALERT });

export const toggleArchived = (showArchived) => (dispatch) => {
  dispatch(({ type: types.TOGGLE_ARCHIVED, showArchived }));
};

export const loadUsdCurrency = () => async (dispatch) => {
  const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
  const data = await response.json();
  const value = data.Valute.USD.Value;

  dispatch({ type: types.SET_USD_CURRENCY, value });
};
export const clearUsdCurrency = () => ({ type: types.CLEAR_USD_CURRENCY });

export const showLoader = () => ({ type: types.SHOW_LOADER });
export const hideLoader = () => ({ type: types.HIDE_LOADER });

export const createimprintFav = (regions) => (dispatch) => {
  const extractVacancies = (companies) => companies.reduce(
    (cumulative, company) => [...cumulative, ...company.vacancies],
    [],
  );

  const imprintFav = cloneObj(regions).map((region) => ({
    id: region.id,
    vacancies: extractVacancies(region.groups?.isFav?.companies),
  }));

  dispatch({ type: types.IMPRINT_FAVORITE, imprintFav });
};

export const removedArchivedFav = (currentSection) => (dispatch, getState) => {
  const { regions } = getState();

  const filteredFavRegions = cloneObj(regions).map((region) => {
    if (!region.groups?.isFav?.companies?.length) {
      return region;
    }

    const removeCompanies = [];

    region.groups.isFav.companies = region.groups.isFav.companies.map((company, i) => {
      company.vacancies = company.vacancies.filter((vacancy) => !vacancy.archived);
      company.archived = [];
      if (!company.vacancies.length) {
        removeCompanies.push(i);
      }

      return company;
    });

    removeCompanies.forEach((removeIndex) => region.groups.isFav.companies.splice(removeIndex, 1));

    return region;
  });

  dispatch(createimprintFav(filteredFavRegions));
  dispatch(visibleVacanciesUpdate(currentSection.id, filteredFavRegions));
  dispatch(toggleArchived(false));
};

export const clearList = (listType) => (dispatch, getState) => {
  const { regions } = getState();
  const currentSection = regions.find((section) => section.isActive);

  dispatch({ type: types.CLEAR_LIST, listType });
  dispatch(filterVacancies(currentSection.allVacancies));

  if (listType === 'imprintFav') {
    dispatch(removedArchivedFav(currentSection));
  }
};

export const addToBlacklist = (e, vacancy) => (dispatch, getState) => {
  e.preventDefault();
  e.stopPropagation();
  const { regions } = getState();
  const currentSection = regions.find((section) => section.isActive);

  // vacancy.is_del = true;

  dispatch({ type: types.ADD_TO_BLACKLIST, vacancyId: vacancy.id });
  dispatch(filterVacancies(currentSection.vacancies, false, false));
};

export const toggleFavorite = (companyId) => (dispatch, getState) => {
  const { regions, app } = getState();
  const currentSection = regions.find((section) => section.isActive);

  const favorites = [...app.favorites];
  const indexOfCompany = favorites.indexOf(companyId);

  if (indexOfCompany !== -1) {
    favorites.splice(indexOfCompany, 1);
  } else {
    favorites.push(companyId);
  }

  dispatch({ type: types.TOGGLE_FAVORITE, favorites });
  dispatch(filterVacancies(currentSection.vacancies, false, false));
  dispatch(createimprintFav(regions));
};

export const updateGroupsVisibility = (sectionId, groupId, isHidden) => (dispatch, getState) => {
  const { hiddenGroups } = getState().app;
  const group = hiddenGroups[sectionId];

  if (isHidden) {
    group.push(groupId);
  } else {
    hiddenGroups[sectionId] = group.filter((hiddenGroupId) => hiddenGroupId !== groupId);
  }

  dispatch({ type: types.UPDATE_GROUPS_VISIBILITY, hiddenGroups });
};
