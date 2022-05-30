import { ShowArchived } from '../../types/initialParams.types';
import { Vacancy } from '../Vacancy/Vacancy.types';

export interface Company {
    id: string,
    name: string,
    sort: {
        name: string,
        sortValue: number
    },
    vacancies: Array<Vacancy>,
    // TODO
    archived: Array<any>,
    isNew: boolean
}
// TODO дублирование
export interface CompanyWrap {
    company: Company,
}

export interface CompanyProps {
    showArchived: ShowArchived,
    company: Company,
    toggleFavorite: any,
}

// TODO
export interface AppProps {
    app: {
        showArchived: ShowArchived
    }
}
