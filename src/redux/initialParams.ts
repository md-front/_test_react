import { calcLastVisit, getDataFromStorage } from '../helpers';
import {
  AppInitState, BaseFormFields, DefaultSearchParams, GroupNames, UrlOption, Region, Regions,
} from '../types/initialParams.types';
import { IGroups } from '../components/Groups/Groups.types';
/*
 * {
 * sortValue: приоритет вывода группы (больше - выше),
 * name: имя для заголовка группы и кнопки в фильтре,
 * isHidden: скрыта ли группа в фильтре,
 * companies: работодатели
 * }
 */
const groups: IGroups = {
  isFav: {
    name: GroupNames.isFav,
    sortValue: 6,
    isHidden: false,
    companies: [],
  },
  isNew: {
    name: GroupNames.isNew,
    sortValue: 5,
    isHidden: false,
    companies: [],
  },
  exp6: {
    name: GroupNames.exp6,
    sortValue: 4,
    isHidden: false,
    companies: [],
  },
  exp3: {
    name: GroupNames.exp3,
    sortValue: 3,
    isHidden: false,
    companies: [],
  },
  isJun: {
    name: GroupNames.isJun,
    sortValue: 2,
    isHidden: false,
    companies: [],
  },
  isSalary: {
    name: GroupNames.isSalary,
    sortValue: 1,
    isHidden: false,
    companies: [],
  },
  default: {
    name: GroupNames.default,
    sortValue: 0,
    isHidden: false,
    companies: [],
  },
};

const DEFAULT_SEARCH_PARAMS: DefaultSearchParams = {
  name: 'Frontend',
  // necessary: ['front', 'фронт', 'js', 'javascript', 'react', 'vue'],
  // unnecessary: ['backend', 'SQL'],
  necessary: [],
  unnecessary: [],
  newInDays: calcLastVisit(),
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

const initialState: Partial<DefaultSearchParams> = (() => {
  const urlParams = (new URL(document.location.href)).searchParams;

  if (!urlParams.toString()) {
    return DEFAULT_SEARCH_PARAMS;
  }

  const result: Partial<DefaultSearchParams> = {};

  // eslint-disable-next-line no-restricted-syntax,guard-for-in
  for (const param in DEFAULT_SEARCH_PARAMS) {
    const dataFromUrl = urlParams.get(param);
    let tempData: any;
    const isKeyword = param === BaseFormFields.necessary || param === BaseFormFields.unnecessary;
    const needDefaultValue = param === BaseFormFields.newInDays
      || param === BaseFormFields.regions
      || param === BaseFormFields.experience;

    const emptyValue = (() => {
      if (needDefaultValue) {
        return DEFAULT_SEARCH_PARAMS[param as keyof DefaultSearchParams];
      }

      if (isKeyword) {
        return [];
      }

      return '';
    })();

    if (dataFromUrl) {
      if (param === BaseFormFields.newInDays) {
        tempData = DEFAULT_SEARCH_PARAMS.newInDays.map((option) => {
          option.checked = option.value === +dataFromUrl;

          return option;
        });
      } else if (isKeyword) {
        tempData = dataFromUrl.split(',');
      } else if (param === BaseFormFields.regions || param === BaseFormFields.experience) {
        tempData = [...DEFAULT_SEARCH_PARAMS[param]];

        const arrDataFromUrl = dataFromUrl.split(',');

        tempData.forEach((option: UrlOption) => option.checked = arrDataFromUrl.includes(option.id));
      } else {
        tempData = dataFromUrl;
      }
    }

    if (param === BaseFormFields.regions) {
      let activeRegion: Region;
      tempData!.forEach((region: Region) => {
        if (!activeRegion && region.checked) {
          activeRegion = region;
          activeRegion.isActive = true;
        } else {
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
  favorites: getDataFromStorage(BaseFormFields.favorites),
  blacklist: getDataFromStorage(BaseFormFields.blacklist),
  hiddenGroups: getDataFromStorage(BaseFormFields.hiddenGroups, initialState.regions),
  loading: 0,
  usdCurrency: false,
  imprintFav: getDataFromStorage(BaseFormFields.imprintFav),
  minSalary: getDataFromStorage(BaseFormFields.minSalary),
  haveArchived: false,
  isSalaryOnly: false,
  showArchived: false,
};
