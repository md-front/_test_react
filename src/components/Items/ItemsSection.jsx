import React from 'react';
// import styles from './ItemsSection.module.scss';
import { sortByReduction, checkItems } from '../../helpers';
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
            groups: props.section.groups || [],
            isLoaded: !!props.section.groups,
            vacancies: props.section.vacancies || []
        }

        this.favoritesAction = this.favoritesAction.bind(this);
        this.blacklistAction = this.blacklistAction.bind(this);
    }

    componentDidMount() {

        if(!this.props.section.visibleVacancies)
            (async () => {
                const vacancies = await this.getVacancies();
                const groups = this.groupVacancies(vacancies);

                const loadedData = {
                    visibleVacancies: this.visibleVacancies(),
                    groups,
                    vacancies: this.state.vacancies
                }

                this.props.handleLoaded(this.props.section.id, loadedData);

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

        /* todo ? как-то вынести за componentDidUpdate? */
        ACTIONS.forEach(action => this.activityCheck(action, prevAllProps));
    }

    visibleVacancies() {
        return this.state.vacancies.length - Object.keys(this.props.blacklist[this.props.section.id]).length;
    }

    activityCheck(action, prevAllProps){
        /* объекты { вакансия: item } / { item: группа } */
        const prevProps = prevAllProps[action.name][this.props.section.id];
        const actualProps = this.props[action.name][this.props.section.id];

        /* id вакансий */
        const prevIds = Object.keys(prevProps);
        const actualIds = Object.keys(actualProps);

        if(prevIds.length === actualIds.length) return;

        /* todo ? убрать if и всё проходить фильтром, стоит ли? */
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

        /* todo ? избавился от лишних if'ов, но выглядит довольно убого */
        const PARAMS = {
            adding: {
                parentId: parentId,
                newGroupId() {
                    return FAVORITE_SORT_VALUE
                },
                createNewGroup() {
                    return this.createGroup("is_fav", FAVORITE_SORT_VALUE);
                }
            },
            removing: {
                parentId: FAVORITE_SORT_VALUE,
                newGroupId(item) {
                    return item.sort.value
                },
                createNewGroup() {
                    return this.createGroup(item.sort.name, item.sort.value);
                }
            }
        }

        const currentParams = isAdding ? PARAMS['adding'] : PARAMS['removing'];

        prevGroup = groups.find(group => group.sortValue === currentParams.parentId);

        item = prevGroup.items.find((item, index) => {
            itemIndex = index;
            return item.id === id;
        })

        newGroup = groups.find(group => group.sortValue === currentParams.newGroupId(item));

        if(!newGroup) {
            newGroup = currentParams.createNewGroup.call(this);
            groups.push(newGroup);
        }

        item.is_fav = isAdding;

        newGroup.items.push(item);

        prevGroup.items.splice(itemIndex, 1);

        newGroup.haveVisibleItem = checkItems(newGroup.items, 'haveVisibleItem');
        prevGroup.haveVisibleItem = checkItems(prevGroup.items, 'haveVisibleItem');

        groups = sortByReduction(groups, 'sortValue');

        this.props.handleLoaded(this.props.section.id, { groups })

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

        item.haveVisibleItem = checkItems(item.items, 'is_del', false);

        let topVacancySort = DEFAULT_SORT;
        item.items.forEach(vacancy => {
            if(!vacancy.is_del && vacancy.sort.value > topVacancySort.value)
                topVacancySort = vacancy.sort;
        })

        if(!item.is_fav && item.sort.value !== topVacancySort.value) {
            item.sort = topVacancySort;

            let newGroup = groups.find(group => group.sortValue === item.sort.value);

            if(!newGroup) {
                newGroup = this.createGroup(item.sort.name, item.sort.value);
                groups.push(newGroup);
            }

            newGroup.items.push(item);

            prevGroup.items.splice(itemIndex, 1);

            newGroup.haveVisibleItem = checkItems(newGroup.items, 'haveVisibleItem');

            groups = sortByReduction(groups, 'sortValue');
        }

        prevGroup.haveVisibleItem = checkItems(prevGroup.items, 'haveVisibleItem');

        groups = sortByReduction(groups, 'sortValue');

        const updatedData = {
            vacancies,
            groups,
            visibleVacancies: this.visibleVacancies()
        }

        this.props.handleLoaded(this.props.section.id, updatedData)

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

        // alert(lastValidDate)

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

            const isJun = vacancy.is_jun || vacancy.name.match(window.JUNIOR);
            const isNew = new Date(vacancy.created_at) > lastValidDate;


            alert(new Date(vacancy.created_at), new Date(vacancy.created_at) > lastValidDate)

            /* Недавняя вакансия в пределах диапазона NEW_IN_DAYS, не добавленная в избранное */
            if(isNew)
                setGroupParams(3, 'is_new');

            /* Вакансия без опыта, todo повторная проверка */
            if(isJun)
                setGroupParams(2, 'is_jun');

            /* В вакансии указана зп */
            if(vacancy.salary)
                setGroupParams(1, 'is_salary');

            function setGroupParams(sortValue, paramName) {
                const sort = {
                    name: paramName,
                    value: sortValue,
                }

                if(item.sort.value < sortValue)
                    item.sort = sort;

                if(vacancy.sort.value < sortValue)
                    vacancy.sort = sort;

                item[paramName] = true;
                vacancy[paramName] = true;
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
            group.haveVisibleItem = checkItems(group.items, 'haveVisibleItem');
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

    /** Render */
    renderItemsOnLoad() {
        return this.visibleVacancies ? this.renderItems() : this.renderItemsIsEmpty();
    }
    renderItems() {
        return (
            this.state.groups.map((item, index) =>
                item.haveVisibleItem &&
                <ItemsInner itemsList={ item }
                            section={ this.props.section }
                            key={ index }
                            handleClickAction={(type, params) => this.props.handleClickAction(type, this.props.section.id, params)} />
            )
        )
    }
    renderItemsIsEmpty() {
        return <h3>Подходящих вакансий не найдено :(</h3>;
    }

    render() {

        return (
            <section>
                { this.state.isLoaded ?
                    this.renderItemsOnLoad()
                    :
                    <h3>Загрузка...</h3>
                }
            </section>
        );
    }
}
