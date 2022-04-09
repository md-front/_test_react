import { Vacancy } from '../Vacancy/Vacancy.types';

export interface Company {
    id: string,
    name: string,
    sort: {
        name: string,
        sortValue: number
    },
    vacancies: Array<Vacancy>,
    isNew: boolean
}
// TODO
export interface CompanyWrap {
    company: Company
}

export interface CompanyProps {
    company: Company,
    toggleFavorite: any,
}
