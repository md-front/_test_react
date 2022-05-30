import { imprintFav } from '../../types/initialParams.types';

export interface HeaderProps {
    imprintFav: Array<imprintFav>,
    blacklist: Array<number>,
    favorites: Array<number>,
    showArchived: boolean,
    clearList: (type: keyof HeaderProps) => void
    toggleArchived: (showArchived: boolean) => void
}

export interface Btn {
    type: keyof HeaderProps,
    className: string,
    disableClassName: string,
    text: string,
    tip: string,
}

// TODO
export interface AppProps {
    app: HeaderProps
}
