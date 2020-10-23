import React from 'react';
import ItemsTitle from './ItemsTitle';
import ItemsList from './ItemsList';

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
            items: [],
            vacancies: []
        }
    }

    componentDidMount() {
        (async () => {
            const vacancies = await this.getVacancies();
            const items = this.groupVacancies(vacancies);

            this.setState({items})
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

        const items = [...this.state.items];

        if(prevVacanciesIds.length === actualVacanciesIds.length) return

        /* todo ? как отрефакторить? */
        if(prevVacanciesIds.length > actualVacanciesIds.length) {
            const changedVacanciesId = prevVacanciesIds.filter(id => !actualVacanciesIds.includes(id));

            changedVacanciesId.forEach(vacancyId => changeStatus(vacancyId, prevProps))
        } else {
            const vacancyId = actualVacanciesIds.find(vacancyId => !prevVacanciesIds.includes(vacancyId));

            changeStatus(vacancyId, actualProps);
        }

        /* todo ? вынести во внешний метод? */
        function changeStatus(vacancyId, typeProps) {
            const group = items.find(group => group.id === typeProps[vacancyId]);
            const vacancy = group.items.find(vacancy => vacancy.id === vacancyId);

            vacancy[actionTypes[type]] = !vacancy[actionTypes[type]];

            group.haveVisibleItem = group.items.some(vacancy => !vacancy.is_del)
        }

        this.setState({ items });
    }

    /** DATA */
    async getVacancies() {
        let zeroStep = await this.getVacanciesStep(0,'noExperience'); /* todo ? как лучше реализовать отдельный запрос */
        let result = zeroStep.items.map(item => {
            item.is_jun = true;
            return item;
        });

        let firstStep = await this.getVacanciesStep();
        result = [...result, ...firstStep.items];
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
                items: json.items,
                pagesLeft: json.pages
            };
        } else {
            return new Error("Ошибка HTTP: " + response.status);
        }
    }
    groupVacancies(vacancies) {
        let result = {};
        let validVacancies = [];

        vacancies.forEach(vacancy => {
            /* Проверка на кейворды в имени  */
            if(!vacancy.name.match(window.NECESSARY) || vacancy.name.match(window.UNNECESSARY)) return

            const EMPLOYER = vacancy.employer;
            const EMPLOYER_ID = EMPLOYER.id;

            if(!result.hasOwnProperty(EMPLOYER_ID)) {
                result[EMPLOYER_ID] = {
                    id: EMPLOYER_ID,
                    name: EMPLOYER.name,
                    items: [],
                    haveVisibleItem: false,
                }
            }


            /* Проверка дублирования вакансий в группе */
            if(result[EMPLOYER_ID].items.some(item => item.name === vacancy.name)) return;

            /* Проверка на начиние в блеклисте */
            if(this.props.blacklist[this.props.section.id].hasOwnProperty(vacancy.id))
                vacancy.is_del = true;
            else
                result[EMPLOYER_ID].haveVisibleItem = true;

            /* Недавняя вакансия в пределах диапозона NEW_IN_DAYS */
            if(new Date(vacancy.created_at) > window.VALID_NEW_DATE)
                result[EMPLOYER_ID].is_new = true;

            /* Вакансия без опыта, todo повторная проверка */
            if(!vacancy.is_jun && vacancy.name.match(window.JUNIOR))
                result[EMPLOYER_ID].is_jun = true;

            /* Вакансия в избранном */
            if(this.props.favorites[this.props.section.id].hasOwnProperty(vacancy.id))
                vacancy.is_fav = true;

            result[EMPLOYER_ID].items.push(vacancy);
            validVacancies.push(vacancy);
        })

        this.setState({ vacancies: validVacancies })

        return Object.values(result);
    }

    render() {
        const visibleVacancies = this.state.vacancies.length - Object.keys(this.props.blacklist[this.props.section.id]).length;

        return (
            <section>
                <ItemsTitle title={this.props.section.name}
                            quantity={visibleVacancies} />

                { visibleVacancies ?
                    <ItemsList items={this.state.items}
                               handleClickAction={(type, params) => this.props.handleClickAction(type, this.props.section.id, params)} />
                    :
                    <h3>Подходящих вакансий не найндено :(</h3>
                }

            </section>
        );
    }
}
