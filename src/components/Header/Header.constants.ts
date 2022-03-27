import {Btn} from "./Header.types";

export const BUTTONS_DATA: Array<Btn> = [
    {
        type: 'favorites',
        className: 'fav',
        disableClassName: 'fav-disabled',
        text: 'Очистить избранное',
    },
    {
        type: 'blacklist',
        className: 'del',
        disableClassName: 'del-disabled',
        text: 'Отобразить скрытые вакансии',
    },
]