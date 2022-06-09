import { Company } from '../Company/Company.types';
import { Vacancy } from '../Vacancy/Vacancy.types';

export type Companies = Array<Company>;

export type FindSome = (company: Company, param: keyof Vacancy) => boolean

export interface GroupProps {
    companies: Companies,
    name: string
}

export interface IGroup {
    name: string,
    sortValue?: number,
    isHidden?: boolean,
    companies: Companies
}
