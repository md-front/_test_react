import { IsSalaryOnly, SalaryStat, ShowArchived } from '../../types/initialParams.types';

export interface HeaderProps {
    blacklist: Array<number>,
    favorites: Array<number>,
    showArchived: ShowArchived,
    isSalaryOnly: IsSalaryOnly,
    haveArchived: boolean,
    salaryStat: SalaryStat,
    clearList: (type: keyof HeaderProps) => void
    removeArchived: () => void
    toggleVisibilityArchived: (showArchived: boolean) => void
    toggleSalaryOnly: () => void
}

export interface Btn {
    type: keyof HeaderProps,
    className: string,
    disableClassName: string,
    text: string,
    tip: string,
}

export interface AppProps {
    app: HeaderProps
}
