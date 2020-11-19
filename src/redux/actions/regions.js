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

    if(!currentActive.checked) {
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
}

export const toggleSectionVisibility = (sectionId, groupId) => (dispatch, getState) => {
    const regions = [...getState().regions].map(section => {
        if(section.id === sectionId) {
            const group = section.groups[groupId];
            group.is_hidden = !group.is_hidden;
        }

        return section;
    });

    dispatch({ type: types.UPDATE_DATA, regions })
}

export const getSectionData = section => async (dispatch, getState) => {
    const {regions, form} = getState();
    // const section = regions.find(section => section.id === sectionId);
    const FAVORITE_SORT_VALUE = 6;
    const DEFAULT_SORT = {
        name: 'default',
        value: 0
    };

    const allVacancies = await getVacancies();
    const {vacancies, groups} = groupVacancies(allVacancies);

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

    function groupVacancies(allVacancies) {
        let items = {};
        let vacancies = [];
        const newInDays = form.newInDays.find(option => option.checked);
        const lastValidDate = new Date(new Date() - (+newInDays * 24 * 60 * 60 * 1000));

        allVacancies.forEach(vacancy => {
            /** Проверка на кейворды в имени  */
            const necessary = form.necessary;
            const unnecessary = form.unnecessary;

            const toRegExp = arr => new RegExp(arr.join('|'), 'i');

            if((necessary.length && !vacancy.name.match(toRegExp(necessary))) || (unnecessary.length && vacancy.name.match(unnecessary))) return;

            const employerId = vacancy.employer.id;

            if(!items.hasOwnProperty(employerId))
                items[employerId] = {
                    id: employerId,
                    name: vacancy.employer.name,
                    sort: DEFAULT_SORT,
                    items: [],
                    haveVisibleItem: false,
                }

            let item = items[employerId];

            /** Проверка дублирования вакансий в группе */
            if(item.items.some(item => item.name === vacancy.name)) return;

            vacancy.sort = DEFAULT_SORT;

            /** Проверка на наличие в блеклисте */
            // if(this.props.blacklist[this.props.section.id].hasOwnProperty(vacancy.id))
            if(false)
                vacancy.is_del = true;
            else
                item.haveVisibleItem = true;

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
            if (vacancy.is_jun || vacancy.name.match(window.JUNIOR))
                setItemParams(2, 'is_jun');

            /** В вакансии указана зп */
            if (vacancy.salary)
                setItemParams(1, 'is_salary');

            function setItemParams(sortValue, paramName) {
                const sort = {
                    name: paramName,
                    value: sortValue,
                }

                if(item.sort.value < sortValue)
                    item.sort = sort;

                if(vacancy.sort.value < sortValue)
                    vacancy.sort = sort;

                // item[paramName] = true;
                vacancy[paramName] = true;
            }

            item.items.push(vacancy);
            vacancies.push(vacancy);
        })

        return {vacancies, groups: groupItems(Object.values(items))};
    }

    function groupItems(items) {
        const groups = {...section.groups};


        items.forEach(item => {
            let container = groups[item.sort.name].items;
            if(!container) container = [];

            container.push(item)
        });

        return groups
    }


    const newRegions = cloneObj(regions).map(region => {
        if(region.id === section.id)
            region.groups = groups;

        return region;
    })

    dispatch({ type: types.UPDATE_DATA, regions: newRegions })
}