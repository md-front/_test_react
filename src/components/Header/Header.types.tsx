export interface HeaderProps {
    blacklist: Array<number>,
    favorites: Array<number>,
    clearList: (type: keyof HeaderProps) => void
}

export interface Btn {
    type: keyof HeaderProps,
    className: string,
    disableClassName: string,
    text: string,
}

// TODO
export interface HeaderState {
    app: HeaderProps
}