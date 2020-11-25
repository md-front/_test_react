import {getDataFromStorage} from "../helpers";
/**
 * {
 * sortValue: приоритет вывода группы (больше - выше),
 * name: имя для заголовка группы и кнопки в фильтре,
 * is_hidden: скрыта ли группа в фильтре,
 * companies: работодатели
 * }
 */
const groups = {
    is_fav: {
        name: 'Избранное',
        sortValue: 6,
        is_hidden: false,
        companies: [],
    },
    is_new: {
        name: 'Новые',
        sortValue: 5,
        is_hidden: false,
        companies: []
    },
    exp6: {
        name: 'Опыт > 6 лет',
        sortValue: 4,
        is_hidden: false,
        companies: []
    },
    exp3: {
        name: 'Опыт 3-6 лет',
        sortValue: 3,
        is_hidden: false,
        companies: []
    },
    is_jun: {
        name: 'Для начинающих',
        sortValue: 2,
        is_hidden: false,
        companies: []
    },
    is_salary: {
        name: '1-3 c указанным окладом',
        sortValue: 1,
        is_hidden: false,
        companies: []
    },
    default: {
        name: 'Опыт 1-3 года',
        sortValue: 0,
        is_hidden: false,
        companies: []
    },
}

const DEFAULT_SEARCH_PARAMS = {
    name: 'Frontend',
    necessary: ['front', 'фронт', 'js', 'javascript', 'react'],
    unnecessary: ['backend', 'fullstack', 'SQL', 'lead', 'ведущий', 'angular', 'Сима-ленд'],
    newInDays: [
        {
            value: 1,
            label: '1 день',
            checked: true,
        },
        {
            value: 2,
            label: '2 дня',
            checked: false,
        },
        {
            value: 3,
            label: '3 дня',
            checked: false,
        },
        {
            value: 7,
            label: '1 неделю',
            checked: false,
        },
        {
            value: 14,
            label: '2 недели',
            checked: false,
        }
    ],
    experience: [
        {
            id: 'noExperience',
            modifier: 'is_jun',
            name: 'Нет опыта',
            checked: true,
        },
        {
            id: 'between1And3',
            modifier: '_default',
            name: 'От 1 года до 3 лет',
            checked: true,
        },
        {
            id: 'between3And6',
            modifier: 'exp3',
            name: 'От 3 до 6 лет',
            checked: false,
        },
        {
            id: 'moreThan6',
            modifier: 'exp6',
            name: 'Более 6 лет',
            checked: false,
        }
    ],
    regions: [
        {
            id: 'msk',
            name: 'Москва',
            location: 'area=1',
            is_active: false,
            checked: false,
            groups
        },
        {
            id: 'spb',
            name: 'Санкт-Петербург',
            location: 'area=2',
            is_active: false,
            checked: false,
            groups
        },
        {
            id: 'ekb',
            name: 'Екатеринбург',
            location: 'area=3',
            is_active: true,
            checked: true,
            groups
        },
        {
            id: 'remote',
            name: 'Удалённая работа',
            location: 'schedule=remote',
            is_active: false,
            checked: true,
            groups
        }
    ],
}

/* TODO react router */
const initialState = (() => {
    let result = {};
    const urlParams = (new URL(document.location)).searchParams;

    if(!urlParams.toString())
        return DEFAULT_SEARCH_PARAMS;

    for(let param in DEFAULT_SEARCH_PARAMS) {
        let dataFromUrl = urlParams.get(param);
        let tempData;
        const isKeyword = param === 'necessary' || param === 'unnecessary';
        const needDefaultValue = param === 'newInDays' || param === 'regions' || param === 'experience' /* || param === 'name'*/
        const emptyValue = (()=> {

            if(needDefaultValue)
                return DEFAULT_SEARCH_PARAMS[param];

            if(isKeyword)
                return [];

            return ''
        })();

        if(param === 'newInDays') {
            tempData = [...DEFAULT_SEARCH_PARAMS[param]].map(option => {
                option.checked = option.value === +dataFromUrl;

                return option;
            });
        } else if(dataFromUrl && isKeyword) {
            tempData = dataFromUrl.split(',');
        } else if(dataFromUrl && (param === 'regions' || param === 'experience')) {
            tempData = [...DEFAULT_SEARCH_PARAMS[param]];
            dataFromUrl = dataFromUrl.split(',');

            tempData.forEach(option => option.checked = dataFromUrl.includes(option.id))
        } else {
            tempData = dataFromUrl;
        }

        if(param === 'regions') {
            let activeRegion;
            tempData.forEach(region => {
                if(!activeRegion && region.checked) {
                    activeRegion = region;
                    activeRegion.is_active = true;
                } else {
                    region.is_active = false;
                }
            })
        }

        result[param] = tempData ? tempData : emptyValue;
    }

    return result;
})();

export const formInitState = {
    name: initialState.name,
    necessary: initialState.necessary,
    unnecessary: initialState.unnecessary,
    newInDays: initialState.newInDays,
    experience: initialState.experience
};
export const regionsInitState = [
    ...initialState.regions
];

export const appInitState = {
    showAlert: false,
    favorites: getDataFromStorage('favorites'),
    blacklist: getDataFromStorage('blacklist'),
    showLoader: true,
    usdCurrency: false,
}