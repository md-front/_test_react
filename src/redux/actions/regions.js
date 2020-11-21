import * as types from '../types/regions'
import {cloneObj, parseDateString} from "../../helpers";

export const changeActiveSection = id => (dispatch, getState) => {
    const {stateRegions} = getState();
    const regions = [...stateRegions].map(region => {
        region.is_active = region.id === id;

        return region
    })

    dispatch({ type: types.UPDATE_DATA, regions });
}

export const changeSelectedRegions = regions => dispatch => {
    const currentActive = regions.find(region => region.is_active);
    const isActiveRegionChanged = !currentActive.checked;

    if(isActiveRegionChanged) {
        let newActive;

        regions.forEach(region => {
            if(!newActive && region.checked)
                newActive = region;
            else
                region.is_active = false
        });

        newActive.is_active = true;
    }

    dispatch({ type: types.UPDATE_DATA, regions })

    if(!isActiveRegionChanged)
        dispatch(updateCurrentSectionData(currentActive))
}

export const toggleSectionVisibility = (sectionId, groupId) => (dispatch, getState) => {
    // const hiddenSections = []; filtered?
    const regions = [...getState().regions].map(section => {
        if(section.id === sectionId) {
            const group = section.groups[groupId];
            group.is_hidden = !group.is_hidden;
        }

        return section;
    });

    dispatch({ type: types.UPDATE_DATA, regions });
}

export const filterVacancies = (presetVacancies, setAllItems = false, keywordValidation = true) => (dispatch, getState) => {
    const JUNIOR = new RegExp(/junior|стажер|младший|помощник/i);

    const {form, regions, app} = getState();
    const currentSection = regions.find(region => region.is_active);

    const vacancies = presetVacancies ? presetVacancies : currentSection.allVacancies;

    const sortParams = type => ({
        name: type,
        sortValue: currentSection.groups[type].sortValue,
    })


    const toRegExp = arr => new RegExp(arr.join('|'), 'i');
    const validNecessary = titles => !form.necessary.length || titles.match(toRegExp(form.necessary));
    const validUnnecessary = titles => !form.unnecessary.length || !titles.match(toRegExp(form.unnecessary));

    const newInDays = form.newInDays.find(option => option.checked);
    const lastValidDate = new Date(new Date() - (+newInDays.value * 24 * 60 * 60 * 1000));

    const items = {};
    const filteredVacancies = [];

    vacancies.forEach(vacancy => {

        /** Проверка дублирования вакансий у одного работодателя */
        const employerId = vacancy.employer.id;
        let itemSort;

        if(app.favorites.includes(employerId))
            itemSort = sortParams('is_fav')
        else
            itemSort = sortParams('default')

        if(!items.hasOwnProperty(employerId))
            items[employerId] = {
                id: employerId,
                name: vacancy.employer.name,
                sort: itemSort,
                items: [],
                haveVisibleItem: false,
            }
        else if(items[employerId].items.some(employerVacancy => employerVacancy.name === vacancy.name)) return;


        if(setAllItems)
            if(currentSection.allVacancies)
                currentSection.allVacancies.push(vacancy);
            else
                currentSection.allVacancies = [vacancy];

        if(keywordValidation) {
            const titles = `${vacancy.name} ${vacancy.employer.name}`;
            if(!(validNecessary(titles) && validUnnecessary(titles))) return;
        }

        const item = items[employerId];
        vacancy.sort = sortParams('default');

        /** Проверка на наличие в блеклисте */
        if(app.blacklist.includes(vacancy.id)) return;

        /** Недавняя вакансия в пределах диапазона NEW_IN_DAYS */
        if(parseDateString(vacancy.created_at) > lastValidDate)
            setItemParams(5, 'is_new');

        /** Опыт > 6 лет */
        if(vacancy.exp6)
            setItemParams(4, 'exp6');

        /** Опыт 3 - 6 лет */
        if(vacancy.exp3)
            setItemParams(3, 'exp3');

        /** Вакансия без опыта */
        if (vacancy.is_jun || vacancy.name.match(JUNIOR))
            setItemParams(2, 'is_jun');

        /** В вакансии указана зп */
        if (vacancy.salary)
            setItemParams(1, 'is_salary');

        function setItemParams(sortValue, paramName) {
            const sort = {
                name: paramName,
                sortValue,
            }

            if(item.sort.sortValue < sortValue)
                item.sort = sort;

            if(vacancy.sort.sortValue < sortValue)
                vacancy.sort = sort;

            vacancy[paramName] = true;
        }

        item.items.push(vacancy);
        filteredVacancies.push(vacancy);
    });

    currentSection.groups = groupItems(Object.values(items));
    currentSection.vacancies = filteredVacancies;

    dispatch(visibleVacanciesUpdate(currentSection.id, regions));


    function groupItems(items) {
        const groups = {...currentSection.groups};

        for(let group in groups)
            groups[group].items = []

        items.forEach(item => {

            if(!item.items.length) return;

            let container = groups[item.sort.name].items;
            if(!container) container = [];

            container.push(item)
        });

        return groups
    }
}

export const updateCurrentSectionData = section => async (dispatch, getState) => {
    const {form} = getState();

    const newVacancies = await getVacancies();

    dispatch(filterVacancies(newVacancies, true));



    async function getVacancies() {
        const experience = form.experience.filter(exp => exp.checked);
        const result = [];

        for (const exp of experience) {
            let expResult = [];
            let {vacancies, pagesLeft} = await getVacanciesStep(0,exp.id);

            expResult.push(...vacancies);

            if(window.LOAD_ALL_DATA)
                while(--pagesLeft > 0) {
                    const {vacancies} = getVacanciesStep(pagesLeft,exp.id);

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
            let response = await fetch(`https://api.hh.ru/vacancies?text=${form.name}&${section.location}&per_page=${window.LOAD_ALL_DATA ? 100 : 3}&page=${pageNum}&experience=${exp}`);

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

const visibleVacanciesUpdate = (changedSectionId, newRegionsData) => (dispatch) => {
    const regions = cloneObj(newRegionsData).map(section => {

        if(section.id === changedSectionId)
            section['visibleVacancies'] = Object.values(section.groups).reduce((visibleInGroup, group) => {

                if(!group.is_hidden)
                    visibleInGroup += group.items.reduce((visibleInItem, item) => visibleInItem += item.items.filter(vacancy => !vacancy.is_del).length, 0)

                return visibleInGroup;
            }, 0);

        return section;
    })

    dispatch({ type: types.UPDATE_DATA, regions })
}