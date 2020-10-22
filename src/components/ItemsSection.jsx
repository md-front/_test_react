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
            // vacancies: [],
            visibleVacancies: 0,
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
        ['favorites','blacklist'].forEach(type => {
            /* объекты { вакансия: группа } */
            const prevProps = prevAllProps[type];
            const actualProps = this.props[type];

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

                if(!group) return;

                const vacancy = group.items.find(vacancy => vacancy.id === vacancyId);

                vacancy[actionTypes[type]] = !vacancy[actionTypes[type]];

                group.haveVisibleItem = group.items.some(vacancy => !vacancy.is_del)
            }

            this.setState({ items });
        })
    }

    /** DATA */
    async getVacancies() {
        let zeroStep = await this.getVacanciesStep(0,'noExperience');
        let result = zeroStep.items.map(item => {
            item.no_exp = true;
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

        // this.setState({ vacancies: result })

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
        let visibleVacancies = 0;
        let prevVacancyName = '';

        vacancies.forEach(vacancy => {

            /* Проверка дублей вакансии */
            if(vacancy.name === prevVacancyName) return;

            /* Проверка на кейворды в имени  */
            if(!vacancy.name.match(window.NECESSARY) || vacancy.name.match(window.UNNECESSARY)) return;

            prevVacancyName = vacancy.name;

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

            /* Проверка на начиние в блеклисте */
            if(this.props.blacklist.hasOwnProperty(vacancy.id)) {
                vacancy.is_del = true;
            } else {
                result[EMPLOYER_ID].haveVisibleItem = true
                visibleVacancies++;
            }

            /* Недавняя вакансия в пределах диапозона NEW_IN_DAYS */
            if(new Date(vacancy.created_at) > window.VALID_NEW_DATE)
                vacancy.is_new = true;

            /* Вакансия без опыта, todo повторная проверка */
            if(!vacancy.no_exp && vacancy.name.match(window.JUNIOR))
                vacancy.no_exp = true;

            /* Вакансия в избранном */
            if(this.props.favorites.hasOwnProperty(vacancy.id))
                vacancy.is_fav = true;

            result[EMPLOYER_ID].items.push(vacancy)
        })

        this.setState({ visibleVacancies })

        return Object.values(result);
    }

    render() {
        return (
            <section>
                <ItemsTitle title={this.props.section.name}
                            quantity={this.state.visibleVacancies - Object.keys(this.props.blacklist).length} />
                <ItemsList items={this.state.items}
                           haveVisibleItem={this.state.haveVisibleItem}
                           handleClickAction={this.props.handleClickAction} />
            </section>
        );
    }
}
