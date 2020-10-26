import React from 'react';
import { sortByReduction, checkItems } from '../../helpers/helpers';
import ItemsTitle from './ItemsTitle';
import ItemsInner from './ItemsInner';

/* todo ? вынести эти параметры из всех компонентов глобально? */
const ACTION_TYPES = {
    favorites: 'is_fav',
    blacklist: 'is_del',
}

const FAVORITE_SORT_VALUE = 4;

const DEFAULT_SORT = {
    name: 'default',
    value: 0
};

export default class ItemsSection extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            groups: [],
            isLoaded: false,
            vacancies: []
        }

        this.favoritesAction = this.favoritesAction.bind(this);
        this.blacklistAction = this.blacklistAction.bind(this);
    }

    componentDidMount() {
        (async () => {
            const vacancies = await this.getVacancies();
            const groups = this.groupVacancies(vacancies);

            this.setState({ groups, isLoaded: true })
        })()
    }
    componentDidUpdate(prevAllProps) {

        const ACTIONS = [
            {
                name: 'favorites',
                init: this.favoritesAction
            },
            {
                name: 'blacklist',
                init: this.blacklistAction
            },
        ]

        /* todo ? как вынести за componentDidUpdate? */
        ACTIONS.forEach(action => this.activityCheck(action, prevAllProps));
    }

    activityCheck(action, prevAllProps){
        /* объекты { вакансия: группа } */
        const prevProps = prevAllProps[action.name][this.props.section.id];
        const actualProps = this.props[action.name][this.props.section.id];

        /* id вакансий */
        const prevIds = Object.keys(prevProps);
        const actualIds = Object.keys(actualProps);

        if(prevIds.length === actualIds.length) return;

        if(prevIds.length > actualIds.length) {
            const changedIds = prevIds.filter(id => !actualIds.includes(id));

            changedIds.forEach(changedId => {
                const parentId = prevProps[changedId];

                action.init(action.name, changedId, parentId, false)
            })
        } else {
            const changedId = actualIds.find(vacancyId => !prevIds.includes(vacancyId));
            const parentId = actualProps[changedId];

            action.init(action.name, changedId, parentId, true);
        }
    }
    favoritesAction(type, id, parentId, isAdding) {
        let groups = [...this.state.groups];
        let prevGroup;
        let newGroup;
        let item;
        let itemIndex;

        if(isAdding) {
            prevGroup = groups.find(group => group.sortValue === parentId);

            item = prevGroup.items.find((item, index) => {
                itemIndex = index;
                return item.id === id;
            })

            newGroup = groups.find(group => group.sortValue === FAVORITE_SORT_VALUE);

            if(!newGroup) {
                newGroup = this.createGroup("is_fav", FAVORITE_SORT_VALUE);
                groups.push(newGroup);
            }
        } else {
            /* Группа работодателей по типу */
            prevGroup = groups.find(group => group.sortValue === FAVORITE_SORT_VALUE);

            /* Работодатель */
            item = prevGroup.items.find((item, index) => {
                itemIndex = index;
                return item.id === id;
            });

            newGroup = groups.find(group => group.sortValue === item.sort.value);

            if(!newGroup) {
                newGroup = this.createGroup(item.sort.name, item.sort.value);
                groups.push(newGroup);
            }
        }

        newGroup.items.push(item);

        prevGroup.items.splice(itemIndex, 1);

        newGroup.haveVisibleItem = newGroup.items && newGroup.items.some(item => item.haveVisibleItem);
        prevGroup.haveVisibleItem = prevGroup.items && prevGroup.items.some(item => item.haveVisibleItem);

        groups = sortByReduction(groups, 'sortValue');

        this.setState({ groups });
    }

    blacklistAction(type, id, parentId) {
        let groups = [...this.state.groups];
        let vacancies = [...this.state.vacancies];

        const vacancy = vacancies.find(vacancy => vacancy.id === id);

        vacancy[ACTION_TYPES[type]] = !vacancy[ACTION_TYPES[type]];

        /* Группа работодателей по типу */
        let prevGroup;
        let item;
        let itemIndex;

        /* todo переделать на parentId - section.id, избежать обхода всех items */
        for(let i in groups) {
            prevGroup = groups[i];
            item = prevGroup.items.find((item, index) => {
                itemIndex = index;
                return item.id === parentId;
            });

            if(item)
                break;
        }

        /* TODO ТУЦ_ТУЦ */
        console.clear();
        console.log('id, parentId',id, parentId);
        console.log('item',item);
        console.log('были в группе:',item.sort.value);

        let topVacancySort = DEFAULT_SORT;
        item.items.forEach(vacancy => {
            if(!vacancy.is_del && vacancy.sort.value > topVacancySort.value)
                topVacancySort = vacancy.sort;
        })

        if(item.sort.value !== topVacancySort.value) {
            item.sort = topVacancySort;

            console.log('переносим в новую:',item.sort.value);

            let newGroup = groups.find(group => group.sortValue === item.sort.value);

            if(!newGroup) {
                newGroup = this.createGroup(item.sort.name, item.sort.value);
                groups.push(newGroup);
            }

            newGroup.items.push(item);

            prevGroup.items.splice(itemIndex, 1);

            newGroup.haveVisibleItem = newGroup.items && newGroup.items.some(item => item.haveVisibleItem);

            groups = sortByReduction(groups, 'sortValue');
        }



        item.haveVisibleItem = checkItems(item.items, 'is_del', false);
        prevGroup.haveVisibleItem = checkItems(prevGroup.items, 'haveVisibleItem');

        groups = sortByReduction(groups, 'sortValue');

        this.setState({ vacancies, groups });
    }

    /** DATA */
    async getVacancies() {
        let zeroStep = await this.getVacanciesStep(0,'noExperience'); /* todo ? как лучше реализовать отдельный запрос */
        let result = zeroStep.vacancies.map(item => {
            item.is_jun = true;
            return item;
        });

        let firstStep = await this.getVacanciesStep();
        result = [...result, ...firstStep.vacancies];
        let pagesLeft = firstStep.pagesLeft;

        if(window.LOAD_ALL_DATA)
            while(--pagesLeft > 0) {
                const step = await this.getVacanciesStep(pagesLeft);
                
                if(!step.items) break;

                result.push(...step.items);
            }

        this.setState({ vacancies: result })

        return result;
    }
    async getVacanciesStep(pageNum = 0, exp = 'between1And3') {
        let response = await fetch(`https://api.hh.ru/vacancies?text=frontend&${this.props.section.location}&per_page=${window.LOAD_ALL_DATA ? 100 : 3}&page=${pageNum}&experience=${exp}`);

        if (response.ok) {
            const json = await response.json();

            return {
                vacancies: json.items,
                pagesLeft: json.pages
            };
        } else {
            return new Error("Ошибка HTTP: " + response.status);
        }
    }
    groupVacancies(vacancies) {
        let items = {};
        let validVacancies = [];
        const lastValidDate = new Date(new Date() - (window.NEW_IN_DAYS * 24 * 60 * 60 * 1000));

        vacancies.forEach(vacancy => {
            /* Проверка на кейворды в имени  */
            if(!vacancy.name.match(window.NECESSARY) || vacancy.name.match(window.UNNECESSARY)) return

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

            /* Проверка дублирования вакансий в группе */
            if(item.items.some(item => item.name === vacancy.name)) return;

            vacancy.sort = DEFAULT_SORT;

            /* Проверка на наличие в блеклисте */
            if(this.props.blacklist[this.props.section.id].hasOwnProperty(vacancy.id))
                vacancy.is_del = true;
            else
                item.haveVisibleItem = true;

            const isJun = !vacancy.is_jun && vacancy.name.match(window.JUNIOR);
            const isNew = new Date(vacancy.created_at) > lastValidDate;

            /* Недавняя вакансия в пределах диапазона NEW_IN_DAYS, не добавленная в избранное */
            if(isNew)
                setGroupParams(3, 'is_new');

            /* Вакансия без опыта, todo повторная проверка */
            if(isJun)
                setGroupParams(2, 'is_jun');

            /* В вакансии указана зп */
            if(vacancy.salary)
                setGroupParams(1, 'salary');

            function setGroupParams(sortValue, paramName) {

                if(item.sort.value < sortValue) {
                    const sort = {
                        name: paramName,
                        value: sortValue,
                    }

                    vacancy.sort = sort;
                    item.sort = sort;
                }

                item[paramName] = true;
            }

            item.items.push(vacancy);
            validVacancies.push(vacancy);
        })

        this.setState({ vacancies: validVacancies })

        return this.groupItems(Object.values(items));
    }

    groupItems(items) {
        const groups = {};

        items.forEach(item => {
            const isFav = this.props.favorites[this.props.section.id].hasOwnProperty(item.id);

            let groupType;
            let sortValue;

            if(isFav) {
                groupType = 'is_fav';
                sortValue = FAVORITE_SORT_VALUE;
            } else {
                groupType = item.sort.name;
                sortValue = item.sort.value;
            }

            if(!groups[groupType])
                groups[groupType] = this.createGroup(groupType, sortValue)

            groups[groupType].items.push(item);
        })

        for(let i in groups) {
            const group = groups[i];
            group.haveVisibleItem = group.items && group.items.some(item => item.haveVisibleItem);
        }

        return sortByReduction(Object.values(groups), 'sortValue');
    }

    createGroup(name, sortValue, items = []) {
        return {
            name,
            sortValue,
            haveVisibleItem: true,
            items
        }
    }

    renderItemsOnLoad(visibleVacancies) {

        if(visibleVacancies)
            return (
                this.state.groups.map((item, index) =>
                    item.haveVisibleItem &&
                    <ItemsInner itemsList={ item }
                                section={ this.props.section }
                                key={ index }
                                handleClickAction={(type, params) => this.props.handleClickAction(type, this.props.section.id, params)} />
                )
            )
        else
            return (
                <h3>Подходящих вакансий не найдено :(</h3>
            )
    }

    render() {
        const visibleVacancies = this.state.vacancies.length - Object.keys(this.props.blacklist[this.props.section.id]).length;

        return (
            <section>
                <ItemsTitle title={ this.props.section.name }
                            isLoaded={ this.state.isLoaded }
                            quantity={ visibleVacancies } />

                { this.state.isLoaded ?
                    this.renderItemsOnLoad(visibleVacancies)
                    :
                    <h3>Загрузка</h3>
                }

            </section>
        );
    }
}
