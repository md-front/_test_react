import React from 'react';
import styles from '../../styles/components/Items/ItemsSection.module.scss';
import {sortByReduction, checkItems, parseDateString} from '../../helpers';
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
            visibleVacancies: props.section.visibleVacancies || 0,
            vacancies: props.section.vacancies || []
        }

        this.favoritesAction = this.favoritesAction.bind(this);
        this.blacklistAction = this.blacklistAction.bind(this);
        this.filterToggleItem = this.filterToggleItem.bind(this);
        this.visibleVacancies = this.visibleVacancies.bind(this);
    }

    componentDidMount() {

        /** get initial data */
        if(!this.props.section.visibleVacancies)
            (async () => {
                const allVacancies = await this.getVacancies();
                const [vacancies, groups] = this.groupVacancies(allVacancies);

                this.updateData({groups, vacancies})
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

        /* todo ? стоит как-то вынести за componentDidUpdate? */
        ACTIONS.forEach(action => this.activityCheck(action, prevAllProps));
    }

    visibleVacancies(groups = this.state.groups) {
        let result = 0;

        for(let i in groups) {
            const group = groups[i];

            if(!group.is_hidden)
                group.items.forEach(item => {
                    if(!item.haveVisibleItem)
                        return;

                    result += item.items.filter(vacancy => !vacancy.is_del).length;
                })
        }

        return result;
    }

    /** Actions */
    activityCheck(action, prevAllProps){
        /** del - {вакансия: item} / fav - {item: группа} / filter - {группа} */
        const prevProps = prevAllProps[action.name][this.props.section.id];
        const actualProps = this.props[action.name][this.props.section.id];

        /** id элементов */
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

        this.updateData({groups})
    }
    blacklistAction(type, id, parentId) {
        let groups = [...this.state.groups];
        let vacancies = [...this.state.vacancies];

        const vacancy = vacancies.find(vacancy => vacancy.id === id);

        vacancy[ACTION_TYPES[type]] = !vacancy[ACTION_TYPES[type]];

        /** Группа работодателей по типу */
        let prevGroup;
        let item;
        let itemIndex;

        /* todo переделать на parentId - section.id, избежать обхода всех items */
        for(let group of groups) {
            let tempIndex;
            item = group.items.find((item, index) => {
                tempIndex = index;
                return item.id === parentId;
            });

            if(item) {
                itemIndex = tempIndex;
                prevGroup = group;
                break;
            }
        }

        item.haveVisibleItem = checkItems(item.items, 'is_del', false);

        let topVacancySort = DEFAULT_SORT;

        item.items.forEach(vacancy => {
            console.log('vacancy',vacancy, topVacancySort)
            if(!vacancy.is_del && vacancy.sort.value > topVacancySort.value)
                topVacancySort = vacancy.sort;
        })

        /** Изменение текущей группы */
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
        }

        prevGroup.haveVisibleItem = checkItems(prevGroup.items, 'haveVisibleItem');

        groups = sortByReduction(groups, 'sortValue');

        this.updateData({vacancies, groups})
    }

    /** Filter actions */
    filterToggleItem(isHidden, groupName) {
        const groups = [...this.state.groups];
        const group = groups.find(group => group.name === groupName);

        group.is_hidden = !isHidden;

        this.props.handleClickAction('filtered', this.props.section.id, {id: groupName})

        this.updateData({groups});
    }

    /** DATA */
    async getVacancies() {
        /* todo ? как лучше реализовать отдельный запрос */
        let zeroStep = await this.getVacanciesStep(0,'noExperience');
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

        this.setState({vacancies: result})

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
    groupVacancies(allVacancies) {
        let items = {};
        let vacancies = [];
        const lastValidDate = new Date(new Date() - (window.NEW_IN_DAYS * 24 * 60 * 60 * 1000));

        allVacancies.forEach(vacancy => {
            /** Проверка на кейворды в имени  */
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

            /** Проверка дублирования вакансий в группе */
            if(item.items.some(item => item.name === vacancy.name)) return;

            vacancy.sort = DEFAULT_SORT;

            /** Проверка на наличие в блеклисте */
            if(this.props.blacklist[this.props.section.id].hasOwnProperty(vacancy.id))
                vacancy.is_del = true;
            else
                item.haveVisibleItem = true;

            /** Недавняя вакансия в пределах диапазона NEW_IN_DAYS, не добавленная в избранное */
            if(parseDateString(vacancy.created_at) > lastValidDate) {
                setItemParams(3, 'is_new');

                /** Вакансия без опыта */
            } else if (vacancy.is_jun || vacancy.name.match(window.JUNIOR)) {
                setItemParams(2, 'is_jun');

                /** В вакансии указана зп */
            } else if (vacancy.salary) {
                setItemParams(1, 'is_salary');

            }

            function setItemParams(sortValue, paramName) {
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
            vacancies.push(vacancy);
        })

        return [vacancies, this.groupItems(Object.values(items))];
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
                groups[groupType] = this.createGroup(groupType, sortValue);

            if(this.props.filtered.hasOwnProperty(groups[groupType].name))
                groups[groupType].is_hidden = true;

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
            items,
            is_hidden: false,
        }
    }
    updateData(payload) {
        const visibleVacancies = this.visibleVacancies(payload.groups);
        const data = {...payload, visibleVacancies};

        this.setState({...data, isLoaded: true});

        this.props.handleLoaded(this.props.section.id, data)
    }

    /** Render */
    renderFilterGroups() {
        return (
            <div className={styles.filter}>
                <div className={styles.title}>Отображение групп:</div>
                {this.state.groups.map((group, index) =>
                    group.haveVisibleItem &&
                    <button type="button"
                            className={!group.is_hidden ? styles['filter-item-active'] : styles['filter-item']}
                            onClick={() => this.filterToggleItem(group.is_hidden, group.name)}
                            key={index}>{window.GROUP_NAMES[group.name]}</button>
                )}
            </div>
        )
    }
    renderItemsOnLoad() {
        return this.state.visibleVacancies > 0 ? this.renderItems() : this.renderItemsIsEmpty();
    }
    renderItems() {
        return (
            this.state.groups.map((group, index) =>
                group.haveVisibleItem && !group.is_hidden &&
                <ItemsInner itemsList={group}
                            section={this.props.section}
                            key={index}
                            handleClickAction={(type, params) => this.props.handleClickAction(type, this.props.section.id, params)} />
            )
        )
    }
    renderItemsIsEmpty() {
        return <h3>Подходящих вакансий не найдено :(</h3>;
    }

    render() {
        return (
            <section className={styles.section}>
                <div className="container">
                    {this.state.isLoaded && this.renderFilterGroups()}
                    {this.state.isLoaded ?
                        this.renderItemsOnLoad()
                        :
                        <div className={styles.loading}>Загрузка <span/></div>
                    }
                </div>
            </section>
        );
    }
}
