import React from 'react';
import ItemsTitle from './ItemsTitle';
import ItemsInner from './ItemsInner';

/* todo ? вынести эти параметры из всех компонентов глобально? */
const actionTypes = {
    favorites: 'is_fav',
    blacklist: 'is_del',
}

// let changedVacation = {};

export default class ItemsSection extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            groups: [],
            isLoaded: false,
            vacancies: []
        }
    }

    componentDidMount() {
        (async () => {
            const vacancies = await this.getVacancies();
            const groups = this.groupVacancies(vacancies);

            this.setState({ groups, isLoaded: true })
        })()
    }
    componentDidUpdate(prevAllProps) {

        /* todo ? как вынести за componentDidUpdate? */
        ['favorites','blacklist'].forEach(type => this.activityCheck(prevAllProps, type));
    }

    activityCheck(prevAllProps, type){
        /* объекты { вакансия: группа } */
        const prevProps = prevAllProps[type][this.props.section.id];
        const actualProps = this.props[type][this.props.section.id];

        /* id вакансий */
        const prevVacanciesIds = Object.keys(prevProps);
        const actualVacanciesIds = Object.keys(actualProps);

        let groups = [...this.state.groups];
        let vacancies = [...this.state.vacancies];

        if(prevVacanciesIds.length === actualVacanciesIds.length) return;

        if(prevVacanciesIds.length > actualVacanciesIds.length) {
            const changedVacanciesId = prevVacanciesIds.filter(id => !actualVacanciesIds.includes(id));

            changedVacanciesId.forEach(vacancyId => changeStatus(vacancyId, prevProps))
        } else {
            const vacancyId = actualVacanciesIds.find(vacancyId => !prevVacanciesIds.includes(vacancyId));

            changeStatus(vacancyId, actualProps);
        }

        /* todo ? вынести во внешний метод? */
        function changeStatus(vacancyId, typeProps) {
            console.log('changeStatus groups',groups);
            // const group = groups.find(group => group.id === typeProps[vacancyId]);
            const vacancy = vacancies.find(vacancy => vacancy.id === vacancyId);

            vacancy[actionTypes[type]] = !vacancy[actionTypes[type]];

            // group.haveVisibleItem = group.groups.some(vacancy => !vacancy.is_del)
        }

        // groups = groups.sort(this.sortGroups);

        this.setState({ vacancies });
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
        let result = {};
        let validVacancies = [];
        const lastValidDate = new Date(new Date() - (window.NEW_IN_DAYS * 24 * 60 * 60 * 1000));

        vacancies.forEach(vacancy => {
            /* Проверка на кейворды в имени  */
            if(!vacancy.name.match(window.NECESSARY) || vacancy.name.match(window.UNNECESSARY)) return

            const EMPLOYER_ID = vacancy.employer.id;

            if(!result.hasOwnProperty(EMPLOYER_ID)) {
                result[EMPLOYER_ID] = {
                    id: EMPLOYER_ID,
                    name: vacancy.employer.name,
                    sort: {
                        value: 0,
                        name: 'default',
                    },
                    items: [],
                    haveVisibleItem: false,
                }
            }

            let group = result[EMPLOYER_ID];

            /* Проверка дублирования вакансий в группе */
            if(group.items.some(item => item.name === vacancy.name)) return;

            /* Проверка на наличие в блеклисте */
            if(this.props.blacklist[this.props.section.id].hasOwnProperty(vacancy.id))
                vacancy.is_del = true;
            else
                group.haveVisibleItem = true;

            const isFav = this.props.favorites[this.props.section.id].hasOwnProperty(vacancy.id);
            const isJun = !vacancy.is_jun && vacancy.name.match(window.JUNIOR);
            const isNew = new Date(vacancy.created_at) > lastValidDate;

            /* Вакансия в избранном */
            if(isFav)
                setGroupParams(4, 'is_fav');
            else
                vacancy.is_fav = false;

            /* Недавняя вакансия в пределах диапазона NEW_IN_DAYS, не добавленная в избранное */
            if(isNew && !isFav)
                setGroupParams(3, 'is_new');

            /* Вакансия без опыта, todo повторная проверка */
            if(isJun)
                setGroupParams(2, 'is_jun');

            /* В вакансии указана зп */
            if(vacancy.salary)
                setGroupParams(1, 'salary');

            group.items.push(vacancy);
            validVacancies.push(vacancy);

            function setGroupParams(sortValue, paramName) {

                if(group.sort.value < sortValue) {
                    vacancy.sortValue = sortValue;
                    group.sort = {
                        value: sortValue,
                        name: paramName
                    }
                }

                group[paramName] = true;
            }
        })

        this.setState({ vacancies: validVacancies })

        return this.groupBySort(Object.values(result));
    }

    groupBySort(groups) {
        const result = {};

        groups.forEach(group => {
            const sortType = group.sort.name;

            if(!result[sortType])
                result[sortType] = {
                    name: sortType,
                    sortValue: group.sort.value,
                    items: [],
                }

            result[sortType].items.push(group);
        })

        return Object.values(result).sort((groupsA, groupsB) => groupsB.sortValue - groupsA.sortValue);
    }

    renderItemsOnLoad(visibleVacancies) {

        if(visibleVacancies)
            return (
                this.state.groups.map((item, index) =>
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
