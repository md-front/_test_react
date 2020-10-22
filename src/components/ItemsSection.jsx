import React from 'react';
import ItemsTitle from './ItemsTitle';
import ItemsList from './ItemsList';

export default class ItemsSection extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            items: [],
            vacancies: [],
            vacanciesLength: 0
        }
    }

    /** DATA */
    componentDidMount() {
        (async () => {
            const vacancies = await this.getVacancies();
            const items = this.groupVacancies(vacancies);

            this.setState({items})
        })()
    }
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

        this.setState({ vacancies: result })

        return result;
    }
    async getVacanciesStep(pageNum = 0, exp = 'between1And3') {
        let response = await fetch(`https://api.hh.ru/vacancies?text=frontend&${this.props.section.location}&per_page=${window.LOAD_ALL_DATA ? 100 : 10}&page=${pageNum}&experience=${exp}`);

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
        let vacanciesLength = 0;
        let prevVacancyName = '';

        vacancies.forEach(vacancy => {

            /* Проверка дублей вакансии */
            if(vacancy.name === prevVacancyName) return;

            /* Проверка на начиние в блеклисте */
            if(this.props.store.blacklist.includes(vacancy.id)) return;

            /* Проверка на кейворды в имени  */
            if(!vacancy.name.match(window.NECESSARY) || vacancy.name.match(window.UNNECESSARY)) return;

            prevVacancyName = vacancy.name;
            vacanciesLength++;

            /* Недавняя вакансия в пределах диапозона NEW_IN_DAYS */
            if(new Date(vacancy.created_at) > window.VALID_NEW_DATE)
                vacancy.is_new = true;

            /* Вакансия без опыта, todo повторная проверка */
            if(!vacancy.no_exp && vacancy.name.match(window.JUNIOR))
                vacancy.no_exp = true;

            /* Вакансия в избранном */
            if(this.props.store.favorites.includes(vacancy.id))
                vacancy.is_fav = true;

            const EMPLOYER = vacancy.employer;
            const EMPLOYER_ID = EMPLOYER.id;

            if(!result.hasOwnProperty(EMPLOYER_ID)) {
                result[EMPLOYER_ID] = {
                    items: [],
                    name: EMPLOYER.name
                }
            }

            result[EMPLOYER_ID].items.push(vacancy)
        })

        this.setState({ vacanciesLength })

        return Object.values(result);
    }



    render() {
        return (
            <section>
                <ItemsTitle title={this.props.section.name}
                            quantity={this.state.vacanciesLength} />
                <ItemsList items={this.state.items}
                           handleClickAction={this.props.handleClickAction} />
            </section>
        );
    }
}
