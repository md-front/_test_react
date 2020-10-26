import React from 'react';
import { sortByReduction } from '../../helpers/helpers';
import ItemsTitle from './ItemsTitle';
import ItemsInner from './ItemsInner';

/* todo ? вынести эти параметры из всех компонентов глобально? */
const ACTION_TYPES = {
    favorites: 'is_fav',
    blacklist: 'is_del',
}

const FAVORITE_SORT_VALUE = 4;

// let changedVacation = {};

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
                action: this.favoritesAction
            },
            {
                name: 'blacklist',
                action: this.blacklistAction
            },
        ]

        /* todo ? как вынести за componentDidUpdate? */
        ACTIONS.forEach(action => this.activityCheck(action, prevAllProps));
    }

    activityCheck(action, prevAllProps){
        const prevProps = prevAllProps[action.name][this.props.section.id];
        const actualProps = this.props[action.name][this.props.section.id];

        if(prevProps.length === actualProps.length) return;

        if(prevProps.length > actualProps.length) {
            const changedIds = prevProps.filter(id => !actualProps.includes(id));

            changedIds.forEach(changedId => action.action(action.name, changedId, false))
        } else {
            const changedId = actualProps.find(vacancyId => !prevProps.includes(vacancyId));

            action.action(action.name, changedId, true);
        }
    }
    favoritesAction(type, id, isAdding) {
        let groups = [...this.state.groups];
        let prevGroup;
        let newGroup;
        let item;
        let itemIndex;

        if(isAdding) {
            /* todo не проходить через все item */
            for(let group of groups) {
                item = group.items.find((item, index) => {
                    itemIndex = index;
                    return item.id === id;
                })

                if(item) break;
            }

            prevGroup = groups.find(group => group.sortValue === item.sort.value);

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

        newGroup.haveVisibleItem = newGroup.items.length > 0;

        prevGroup.haveVisibleItem = prevGroup.items.length > 0;

        groups = sortByReduction(groups, 'sortValue');

        this.setState({ groups });
    }

    blacklistAction(type, id) {
        let groups = [...this.state.groups];
        let vacancies = [...this.state.vacancies];

        const vacancy = vacancies.find(vacancy => vacancy.id === id);

        /* Группа работодателей по типу */
        const group = groups.find(group => group.sortValue === vacancy.sortValue);

        /* Работодатель */
        const item = group.items.find(item => item.id === vacancy.employer.id);

        vacancy[ACTION_TYPES[type]] = !vacancy[ACTION_TYPES[type]];

        item.haveVisibleItem = item.items.some(vacancy => !vacancy.is_del);

        group.haveVisibleItem = group.items.some(item => item.haveVisibleItem);

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
                    sort: {
                        value: 0,
                        name: 'default',
                    },
                    items: [],
                    haveVisibleItem: false,
                }

            let item = items[employerId];

            /* Проверка дублирования вакансий в группе */
            if(item.items.some(item => item.name === vacancy.name)) return;

            /* Проверка на наличие в блеклисте */
            if(this.props.blacklist[this.props.section.id].includes(vacancy.id))
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
                    vacancy.sortValue = sortValue;
                    item.sort = {
                        name: paramName,
                        value: sortValue,
                    }
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
            const isFav = this.props.favorites[this.props.section.id].includes(item.id);

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
