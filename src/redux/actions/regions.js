import * as types from '../types/regions'
import {clearUsdCurrency, hideLoader, loadUsdCurrency, showLoader} from './app'
import {cloneObj, parseDateString} from "../../helpers";

export const changeActiveSection = id => (dispatch, getState) => {
    const {regions} = getState();

    for(let section of regions) {
        section.is_active = section.id === id;

        if(section.is_active && !section.allVacancies)
            dispatch(showLoader());
    }

    dispatch({ type: types.UPDATE_DATA, regions });
}

export const changeSelectedRegions = regions => dispatch => {
    const activeSection = regions.find(region => region.is_active);
    const isActiveRegionChanged = !activeSection.checked;
    let section = activeSection;

    /** Регион новый */
    if(isActiveRegionChanged) {
        let newActive;

        for(let region of regions) {
            if(!newActive && region.checked)
                newActive = region
            else
                region.is_active = false
        }

        newActive.is_active = true;
        section = newActive;

        dispatch({ type: types.UPDATE_DATA, regions });
    }
    
    dispatch(showLoader())
    dispatch(loadData(section))
}

export const toggleSectionVisibility = (sectionId, groupId) => (dispatch, getState) => {
    /* const hiddenSections = []; todo filtered?*/
    const {regions} = getState();
    dispatch(showLoader());

    const currentSection = regions.find(section => section.id === sectionId);

    const group = currentSection.groups[groupId];
    group.is_hidden = !group.is_hidden;

    dispatch(visibleVacanciesUpdate(currentSection.id, regions, groupId))
}

export const filterVacancies = (presetVacancies, setAllVacancies = false, keywordValidation = true) => async (dispatch, getState) => {
    const JUNIOR = new RegExp(/junior|стажер|младший|помощник/i);

    dispatch(showLoader())

    const {form, regions, app} = getState();
    const currentSection = regions.find(section => section.is_active);

    if(setAllVacancies)
        currentSection.allVacancies = [];

    const vacancies = presetVacancies ? presetVacancies : currentSection.allVacancies;

    const sortParams = {
        default: {
            name: 'default',
            sortValue: currentSection.groups['default'].sortValue,
        },
        is_fav: {
            name: 'is_fav',
            sortValue: currentSection.groups['is_fav'].sortValue,
        },
    }

    const toRegExp = arr => new RegExp(arr.join('|'), 'i');
    const validNecessary = titles => !form.necessary.length || titles.match(toRegExp(form.necessary));
    const validUnnecessary = titles => !form.unnecessary.length || !titles.match(toRegExp(form.unnecessary));

    const newInDays = form.newInDays.find(option => option.checked);
    const lastValidDate = new Date(new Date() - (+newInDays.value * 24 * 60 * 60 * 1000));

    const companies = {};
    const filteredVacancies = [];
    let usdLoad = false;

    vacancies.forEach(vacancy => {
        const employerId = vacancy.employer.id;
        const isFav = app.favorites && app.favorites.includes(employerId);
        let companySort = sortParams[isFav ? 'is_fav' : 'default'];

        if(!companies.hasOwnProperty(employerId))
            companies[employerId] = {
                id: employerId,
                name: vacancy.employer.name,
                sort: companySort,
                vacancies: [],
            }
        else if(companies[employerId].vacancies.some(companyVacancy => companyVacancy.name === vacancy.name)) return;

        if(setAllVacancies)
            currentSection.allVacancies.push(vacancy);

        if(keywordValidation) {
            const titles = `${vacancy.name} ${vacancy.employer.name}`;
            if(!(validNecessary(titles) && validUnnecessary(titles))) return;
        }

        const company = companies[employerId];
        vacancy.sort = sortParams['default'];

        /** Проверка на наличие в блеклисте */
        if(app.blacklist.includes(vacancy.id)) return;

        /** Недавняя вакансия в пределах диапазона NEW_IN_DAYS */
        if(parseDateString(vacancy.created_at) > lastValidDate)
            setSortParams(5, 'is_new');

        /** Опыт > 6 лет */
        if(vacancy.exp6)
            setSortParams(4, 'exp6');

        /** Опыт 3 - 6 лет */
        if(vacancy.exp3)
            setSortParams(3, 'exp3');

        /** Вакансия без опыта */
        if (vacancy.is_jun || vacancy.name.match(JUNIOR))
            setSortParams(2, 'is_jun');

        /** В вакансии указана зп */
        if (vacancy.salary) {
            setSortParams(1, 'is_salary');

            if(!usdLoad && !app.usdCurrency && vacancy.salary.currency === 'USD') {
                usdLoad = true;
                dispatch(loadUsdCurrency())
            }
        }

        function setSortParams(sortValue, paramName) {
            const sort = {
                name: paramName,
                sortValue,
            }

            if(company.sort.sortValue < sortValue)
                company.sort = sort;

            if(vacancy.sort.sortValue < sortValue)
                vacancy.sort = sort;

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

        for(let group in groups)
            groups[group].companies = []

        companies.forEach(company => {
            if(!company.vacancies.length) return;

            groups[company.sort.name].companies.push(company)
        });

        return groups
    }
}

let loadingData = false;

export const loadData = section => async (dispatch, getState) => {
    const {form, app} = getState();

    const request = JSON.stringify([form.name, section.location, form.experience]);

    // if(section.prevRequest && section.prevRequest === request) {
    //     if(updateRegions)
    //         dispatch({ type: types.UPDATE_DATA, regions });
    //
    //     dispatch(hideLoader());
    //     return;
    // }

    if(loadingData) return;

    if(!section.prevRequest && section.prevRequest === request) {
        dispatch(hideLoader());
        return;
    }

    loadingData = true;

    section.prevRequest = request;

    if(app.usdCurrency)
        dispatch(clearUsdCurrency());

    const newVacancies = await getVacancies();

    dispatch(filterVacancies(newVacancies, true));

    loadingData = false;

    async function getVacancies() {
        const experience = form.experience.filter(exp => exp.checked);
        const result = [];

        for (const exp of experience) {
            let expResult = [];
            let {vacancies, pagesLeft} = await getVacanciesStep(0,exp.id);

            expResult.push(...vacancies);

            while(--pagesLeft > 0) {
                const {vacancies} = await getVacanciesStep(pagesLeft,exp.id);

                if(!vacancies) break;

                expResult.push(...vacancies);
            }

            expResult = expResult.map(vacancy => {
                vacancy[exp.modifier] = true;
                return vacancy;
            });

            result.push(...expResult);
        }

        return result;
    }
    async function getVacanciesStep(pageNum, exp) {

        try {
            let response = await fetch(`https://api.hh.ru/vacancies?text=${form.name}&${section.location}&per_page=100&page=${pageNum}&experience=${exp}`);

            const json = await response.json();

            return {
                vacancies: json.items,
                pagesLeft: json.pages
            };
        } catch (e) {
            console.error(e);
        }
    }
}

const visibleVacanciesUpdate = (changedSectionId, newRegionsData, groupId = null) => dispatch => {
    const regions = [...newRegionsData];
    const currentSection = regions.find(section => section.id === changedSectionId);

    const reduceVacancy = companies => companies.reduce((visibleInCompanies, company) => visibleInCompanies += company.vacancies.filter(vacancy => !vacancy.is_del).length, 0);

    let result;

    if(groupId) {
        const group = currentSection.groups[groupId];
        const modifier = group.is_hidden ? -1 : 1;

        result = currentSection.visibleVacancies + (reduceVacancy(group.companies) * modifier)
    } else {
        result = Object.values(currentSection.groups).reduce((visibleInGroup, group) => {

            if(!group.is_hidden)
                visibleInGroup += reduceVacancy(group.companies)

            return visibleInGroup;
        }, 0)
    }

    currentSection['visibleVacancies'] = result;

    dispatch({ type: types.UPDATE_DATA, regions });
    dispatch(hideLoader())
}