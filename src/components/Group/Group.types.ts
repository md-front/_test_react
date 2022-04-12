import { Company } from '../Company/Company.types';

// TODO
type Companies = Array<Company>;

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
