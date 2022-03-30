import { getDataFromStorage } from '../helpers';
import {
  AppInitState, DefaultSearchParams, Groups, Regions,
} from '../types/initialParams';
/**
 * {
 * sortValue: приоритет вывода группы (больше - выше),
 * name: имя для заголовка группы и кнопки в фильтре,
 * isHidden: скрыта ли группа в фильтре,
 * companies: работодатели
 * }
 */
const groups: Groups = {
  isFav: {
    name: 'Избранное',
    sortValue: 6,
    isHidden: false,
    companies: [],
  },
  isNew: {
    name: 'Новые',
    sortValue: 5,
    isHidden: false,
    companies: [],
  },
  exp6: {
    name: 'Опыт > 6 лет',
    sortValue: 4,
    isHidden: false,
    companies: [],
  },
  exp3: {
    name: 'Опыт 3-6 лет',
    sortValue: 3,
    isHidden: false,
    companies: [],
  },
  isJun: {
    name: 'Для начинающих',
    sortValue: 2,
    isHidden: false,
    companies: [],
  },
  isSalary: {
    name: '1-3 c указанным окладом',
    sortValue: 1,
    isHidden: false,
    companies: [],
  },
  default: {
    name: 'Опыт 1-3 года',
    sortValue: 0,
    isHidden: false,
    companies: [],
  },
};

const DEFAULT_SEARCH_PARAMS: DefaultSearchParams = {
  name: 'Frontend',
  necessary: ['front', 'фронт', 'js', 'javascript', 'react', 'vue'],
  unnecessary: ['backend', 'SQL'],
  newInDays: [
    {
      value: 1,
      label: '1 день',
      checked: false,
    },
    {
      value: 2,
      label: '2 дня',
      checked: true,
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
    },
  ],
  experience: [
    {
      id: 'noExperience',
      modifier: 'isJun',
      name: 'Нет опыта',
      checked: false,
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
    },
  ],
  regions: [
    {
      id: 'msk',
      name: 'Москва',
      location: 'area=1',
      isActive: false,
      checked: false,
      prevRequest: null,
      groups,
    },
    {
      id: 'spb',
      name: 'Санкт-Петербург',
      location: 'area=2',
      isActive: false,
      checked: false,
      prevRequest: null,
      groups,
    },
    {
      id: 'ekb',
      name: 'Екатеринбург',
      location: 'area=3',
      isActive: true,
      checked: true,
      prevRequest: null,
      groups,
    },
    {
      id: 'remote',
      name: 'Удалённая работа',
      location: 'schedule=remote',
      isActive: false,
      checked: true,
      prevRequest: null,
      groups,
    },
  ],
};

type Test = {
  location: Location
}

/* todo react router */
const initialState: Partial<DefaultSearchParams> = (() => {
  const result = {};
  const { location }: Test = document;
  // @ts-ignore
  const urlParams = (new URL(location)).searchParams;

  if (!urlParams.toString()) {
    return DEFAULT_SEARCH_PARAMS;
  }

  // eslint-disable-next-line no-restricted-syntax,guard-for-in
  for (const param in DEFAULT_SEARCH_PARAMS) {
    let dataFromUrl = urlParams.get(param);
    let tempData;
    const isKeyword = param === 'necessary' || param === 'unnecessary';
    const needDefaultValue = param === 'newInDays' || param === 'regions' || param === 'experience';
    const emptyValue = (() => {
      if (needDefaultValue) {
        // @ts-ignore
        return DEFAULT_SEARCH_PARAMS[param];
      }

      if (isKeyword) {
        return [];
      }

      return '';
    })();

    if (param === 'newInDays') {
      tempData = [...DEFAULT_SEARCH_PARAMS[param]].map((option) => {
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        option.checked = option.value === +dataFromUrl;

        return option;
      });
    } else if (dataFromUrl && isKeyword) {
      tempData = dataFromUrl.split(',');
    } else if (dataFromUrl && (param === 'regions' || param === 'experience')) {
      tempData = [...DEFAULT_SEARCH_PARAMS[param]];
      // @ts-ignore
      dataFromUrl = dataFromUrl.split(',');

      tempData.forEach((option) => {
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        option.checked = dataFromUrl.includes(option.id);
      });
    } else {
      tempData = dataFromUrl;
    }

    if (param === 'regions') {
      // @ts-ignore
      let activeRegion;
      // @ts-ignore
      tempData.forEach((region) => {
        // @ts-ignore
        if (!activeRegion && region.checked) {
          activeRegion = region;
          activeRegion.isActive = true;
        } else {
          // eslint-disable-next-line no-param-reassign
          region.isActive = false;
        }
      });
    }

    // @ts-ignore
    result[param] = tempData || emptyValue;
  }

  return result;
})();

export const formInitState: Partial<DefaultSearchParams> = {
  name: initialState.name,
  necessary: initialState.necessary,
  unnecessary: initialState.unnecessary,
  newInDays: initialState.newInDays,
  experience: initialState.experience,
};
export const regionsInitState: Regions = [
  ...initialState.regions,
];

export const appInitState: AppInitState = {
  showAlert: false,
  favorites: getDataFromStorage('favorites'),
  blacklist: getDataFromStorage('blacklist'),
  hiddenGroups: getDataFromStorage('hiddenGroups', initialState.regions),
  showLoader: true,
  usdCurrency: false,
};
