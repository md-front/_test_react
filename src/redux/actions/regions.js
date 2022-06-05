/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import * as types from '../types/regions';
// TODO
// eslint-disable-next-line import/no-cycle
import {
  createimprintFav,
  hideLoader,
  loadUsdCurrency,
  showLoader,
  updateGroupsVisibility,
  changeHaveArchived,
} from './app';
import { cloneObj, parseDateString } from '../../helpers';
import { JUNIOR } from '../../constants/common';
import { IS_LOCAL_DATA } from '../../main';

export const changeActiveSection = (id) => (dispatch, getState) => {
  const { regions } = getState();

  regions.forEach((section) => {
    // TODO
    // eslint-disable-next-line no-param-reassign
    section.isActive = section.id === id;

    if (section.isActive && !section.allVacancies) {
      dispatch(showLoader());
    }
  });

  dispatch({ type: types.UPDATE_DATA, regions });
};

export const changeSelectedRegions = (regions) => (dispatch) => {
  const activeSection = regions.find((region) => region.isActive);
  const isActiveRegionChanged = !activeSection.checked;
  let section = activeSection;

  /* Регион новый */
  if (isActiveRegionChanged) {
    let newActive;

    regions.forEach((region) => {
      if (!newActive && region.checked) {
        newActive = region;
      } else {
        // TODO
        // eslint-disable-next-line no-param-reassign
        region.isActive = false;
      }
    });

    newActive.isActive = true;
    section = newActive;

    dispatch({ type: types.UPDATE_DATA, regions });
  }

  dispatch(showLoader());
  dispatch(loadData(section));
};

export const toggleGroupVisibility = (sectionId, groupId) => (dispatch, getState) => {
  const { regions } = getState();
  dispatch(showLoader());

  const currentSection = regions.find((section) => section.id === sectionId);

  const group = currentSection.groups[groupId];
  group.isHidden = !group.isHidden;

  dispatch(updateGroupsVisibility(currentSection.id, groupId, group.isHidden));
  dispatch(visibleVacanciesUpdate(currentSection.id, regions, groupId));
};

const createSalaryText = (salary, usdCurrency) => {
  if (!salary) return null;

  const { currency } = salary;
  const formatValue = (value) => Math.round(value).toLocaleString();

  const calcCurrency = ({ salary, type }) => (({ from, to, currency }) => {
    switch (type) {
      case currency:
        return { from, to };
      case 'USD':
        return { from: from / usdCurrency, to: to / usdCurrency };
      default:
        return { from: from * usdCurrency, to: to * usdCurrency };
    }
  })(salary);

  const step = (type) => {
    const { from = 0, to = 0 } = calcCurrency({ type, salary });

    const symbol = (() => {
      switch (type) {
        case 'RUR':
          return 'Р';
        case 'USD':
          return '$';
        default:
          return currency;
      }
    })();

    return (
      `${!to && from ? 'от ' : ''}${from ? formatValue(from) : 'до '}${(from && to) ? ' - ' : ''}${to ? formatValue(to) : ''} ${symbol}`
    );
  };

  const salaryMain = step(currency);
  const salaryAdditional = usdCurrency && (() => {
    switch (currency) {
      case 'RUR':
        return step('USD');
      case 'USD':
        return step('RUR');
      default:
        return null;
    }
  })();

  return [salaryMain, salaryAdditional || ''];
};

const formatVacancy = ({
  id,
  name,
  alternate_url,
  created_at,
  salary,
  employer,
  snippet,
  archived,
}, usdCurrency) => ({
  id,
  name,
  alternateUrl: alternate_url,
  createdAt: created_at,
  salary: {
    component: createSalaryText(salary, usdCurrency),
    ...salary,
  },
  employer: {
    id: employer.id,
    name: employer.name,
    logoUrl: employer.logo_urls?.['90'],
  },
  snippet: snippet.requirement,
  archived,
});

export const filterVacancies = (
  presetVacancies,
  setAllVacancies = false,
  keywordValidation = true,
) => async (dispatch, getState) => {
  dispatch(showLoader());

  const { form, regions, app } = getState();
  const {
    favorites, blacklist, usdCurrency, minSalary, hiddenGroups, isSalaryOnly,
  } = app;
  const currentSection = regions.find((section) => section.isActive);

  if (setAllVacancies) {
    currentSection.allVacancies = [];
  }

  const vacancies = presetVacancies || currentSection.allVacancies;

  if (!vacancies) return;

  const sortParams = {
    default: {
      name: 'default',
      sortValue: currentSection.groups.default.sortValue,
    },
    isFav: {
      name: 'isFav',
      sortValue: currentSection.groups.isFav.sortValue,
    },
  };

  const toRegExp = (arr) => new RegExp(arr.join('|'), 'i');
  const validNecessary = (titles) => !form.necessary.length || titles.match(toRegExp(form.necessary));
  const validUnnecessary = (titles) => !form.unnecessary.length || !titles.match(toRegExp(form.unnecessary));

  const newInDays = form.newInDays.find((option) => option.checked);
  const lastValidDate = new Date(new Date() - (+newInDays.value * 24 * 60 * 60 * 1000));

  const companies = {};
  const filteredVacancies = [];

  vacancies.forEach((vacancy) => {
    vacancy = vacancy.createdAt ? vacancy : formatVacancy(vacancy, usdCurrency);
    const employerId = vacancy.employer.id;
    const isFav = favorites?.includes(employerId);
    const companySort = sortParams[isFav ? 'isFav' : 'default'];

    // eslint-disable-next-line max-len
    const someVacancyHaveParam = (param) => companies[employerId].vacancies.some((companyVacancy) => companyVacancy[param] === vacancy[param]);

    // TODO
    // eslint-disable-next-line no-prototype-builtins
    if (!companies.hasOwnProperty(employerId)) {
      companies[employerId] = {
        id: employerId,
        name: vacancy.employer.name,
        sort: companySort,
        vacancies: [],
        archived: [],
      };
    } else if (someVacancyHaveParam('name')) {
      return;
    }

    if (vacancy.archived) {
      companies[employerId].archived.push(vacancy.id);
      dispatch(changeHaveArchived(true));
    }

    if (setAllVacancies) {
      currentSection.allVacancies.push(vacancy);
    }

    if (keywordValidation) {
      const titles = `${vacancy.name} ${vacancy.employer.name}`;
      if (!(validNecessary(titles) && validUnnecessary(titles))) { return; }
    }

    if (isSalaryOnly && !vacancy.salary?.from) {
      return;
    }

    if (vacancy.salary?.currency === 'RUR' && minSalary) {
      if (vacancy.salary?.to < minSalary && vacancy.salary.from < minSalary) return;
    }

    const company = companies[employerId];
    // TODO
    // eslint-disable-next-line no-param-reassign
    vacancy.sort = sortParams.default;

    /* Проверка на наличие в блеклисте */
    if (blacklist.includes(vacancy.id)) return;

    /* Недавняя вакансия в пределах диапазона NEW_IN DAYS */
    if (parseDateString(vacancy.createdAt) > lastValidDate) {
      setSortParams(5, 'isNew');
    }

    /* Опыт > 6 лет */
    if (vacancy.exp6) {
      setSortParams(4, 'exp6');
    }

    /* Опыт 3 - 6 лет */
    if (vacancy.exp3) {
      setSortParams(3, 'exp3');
    }

    /* Вакансия без опыта */
    if (vacancy.isJun || vacancy.name.match(JUNIOR)) {
      setSortParams(2, 'isJun');
    }

    /* В вакансии указана зп */
    if (vacancy.salary) {
      setSortParams(1, 'isSalary');
    }

    function setSortParams(sortValue, paramName) {
      const sort = {
        name: paramName,
        sortValue,
      };

      if (company.sort.sortValue < sortValue) {
        company.sort = sort;
      }

      if (vacancy.sort.sortValue < sortValue) {
        // TODO
        // eslint-disable-next-line no-param-reassign
        vacancy.sort = sort;
      }

      if (paramName === 'isNew') {
        company[paramName] = true;
      }

      // TODO
      // eslint-disable-next-line no-param-reassign
      vacancy[paramName] = true;
    }

    company.vacancies.push(vacancy);
    filteredVacancies.push(vacancy);
  });

  currentSection.groups = groupCompanies(Object.values(companies));
  currentSection.vacancies = filteredVacancies;

  dispatch(visibleVacanciesUpdate(currentSection.id, regions));

  function groupCompanies(companies) {
    const groups = cloneObj(currentSection.groups);

    // TODO
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const groupName in groups) {
      const group = groups[groupName];
      group.isHidden = hiddenGroups[currentSection.id].includes(groupName);

      group.companies = [];
    }

    companies.forEach((company) => {
      if (!company.vacancies.length) { return; }

      const { companies } = groups[company.sort.name];

      if (company.isNew) {
        companies.unshift(company);
      } else {
        companies.push(company);
      }
    });

    return groups;
  }
};

let loadingData = false;

export const loadData = (section) => async (dispatch, getState) => {
  const { form, app } = getState();

  const request = JSON.stringify([form.name, section.location, form.experience]);

  // if(section.prevRequest && section.prevRequest === request) {
  //     if(updateRegions)
  //         dispatch({ type: types.UPDATE_DATA, regions });
  //
  //     dispatch(hideLoader());
  //     return;
  // }

  if (loadingData) return;

  if (!section.prevRequest && section.prevRequest === request) {
    dispatch(hideLoader());
    return;
  }

  await dispatch(loadUsdCurrency());

  loadingData = true;

  // TODO
  // eslint-disable-next-line no-param-reassign
  section.prevRequest = request;

  const newVacancies = await getVacancies();

  const withNewOne = await testGetVacancy(section.id, newVacancies, app.imprintFav);

  dispatch(filterVacancies(withNewOne, true));
  // dispatch(filterVacancies(newVacancies, true));

  loadingData = false;

  async function getVacancies() {
    const experience = form.experience.filter((exp) => exp.checked);
    const result = [];

    // TODO
    // eslint-disable-next-line no-restricted-syntax
    for (const exp of experience) {
      let expResult = [];
      // eslint-disable-next-line prefer-const,no-await-in-loop
      let { vacancies, pagesLeft } = await getVacanciesStep(0, exp.id);

      expResult.push(...vacancies);

      // TODO
      // eslint-disable-next-line no-plusplus
      while (--pagesLeft > 0) {
        // eslint-disable-next-line no-await-in-loop
        const { vacancies } = await getVacanciesStep(pagesLeft, exp.id);

        if (!vacancies) break;

        expResult.push(...vacancies);
      }

      expResult = expResult.map((vacancy) => {
        // TODO
        // eslint-disable-next-line no-param-reassign
        vacancy[exp.modifier] = true;
        return vacancy;
      });

      result.push(...expResult);
    }

    return result;
  }
  async function getVacanciesStep(pageNum, exp) {
    try {
      const fetchUrl = IS_LOCAL_DATA
        ? 'http://localhost:5000/api/data'
        : `https://api.hh.ru/vacancies?text=${form.name}&${section.location}&per_page=100&page=${pageNum}&experience=${exp}`;
      const response = await fetch(fetchUrl);

      const json = await response.json();

      return {
        vacancies: json.items,
        pagesLeft: json.pages,
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }

    return null;
  }
};

export const visibleVacanciesUpdate = (changedSectionId, newRegionsData, groupId = null) => (dispatch) => {
  const regions = cloneObj(newRegionsData);
  const currentSection = regions.find((section) => section.id === changedSectionId);

  // TODO
  // eslint-disable-next-line max-len
  const reduceVacancy = (companies) => companies.reduce((visibleInCompanies, company) => visibleInCompanies + company.vacancies.filter((vacancy) => !vacancy.isDel).length, 0);

  let result;

  if (groupId) {
    const group = currentSection.groups[groupId];
    const modifier = group.isHidden ? -1 : 1;

    result = currentSection.visibleVacancies + (reduceVacancy(group.companies) * modifier);
  } else {
    result = Object.values(currentSection.groups).reduce((visibleInGroup, group) => {
      if (!group.isHidden) {
        // TODO
        // eslint-disable-next-line no-param-reassign
        visibleInGroup += reduceVacancy(group.companies);
      }

      return visibleInGroup;
    }, 0);
  }

  currentSection.visibleVacancies = result;

  dispatch({ type: types.UPDATE_DATA, regions });
  dispatch(createimprintFav(regions));
  dispatch(hideLoader());
};

export const testGetVacancy = async (sectionId, vacancies, imprintFav) => {
  const currentImprint = imprintFav.find((imprint) => imprint.id === sectionId);

  if (!currentImprint) {
    return vacancies;
  }

  // const promises = currentImprint.vacancies.filter(async (imprintedVacancy) => {
  const promises = currentImprint.vacancies.map(async (imprintedVacancy) => {
    if (!vacancies.some((vacancy) => vacancy.id === imprintedVacancy.id)) {
      imprintedVacancy.archived = true;
      // const fetchUrl = IS_LOCAL_DATA
      //   ? `http://localhost:5000/api/vacancies/${imprintedVacancy.id}`
      //   : `https://api.hh.ru/api/vacancies/${imprintedVacancy.id}`;
      // const response = await fetch(fetchUrl);
      // const json = await response.json();

      // // TODO перебить на боевое

      // if (json.archived) {
      //   return imprintedVacancy;
      // }
      return imprintedVacancy;
    }

    return null;
  });

  const archived = await Promise.all(promises);

  return [...vacancies, ...archived.filter(Boolean)];
};
