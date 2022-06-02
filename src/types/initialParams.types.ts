// type HiddenGroup = Array<keyof Groups>;
import { IGroups } from '../components/Groups/Groups.types';
import { Vacancy } from '../components/Vacancy/Vacancy.types';

export enum GroupNames {
  isFav = 'Избранное',
  isNew = 'Новые',
  exp6 = 'Опыт > 6 лет',
  exp3 = 'Опыт 3-6 лет',
  isJun = 'Для начинающих',
  isSalary = '1-3 c указанным окладом',
  default = 'Опыт 1-3 года',
}

export enum BaseFormFields {
  newInDays = 'newInDays',
  regions = 'regions',
  experience = 'experience',
  favorites = 'favorites',
  blacklist = 'blacklist',
  hiddenGroups = 'hiddenGroups',
  imprintFav = 'imprintFav',
  necessary = 'necessary',
  unnecessary = 'unnecessary',
  minSalary = 'minSalary',
}

type HiddenGroup = Array<any>;

export type HiddenGroups = {
  msk: HiddenGroup,
  spb: HiddenGroup,
  ekb: HiddenGroup,
  remote: HiddenGroup
};

export interface Region {
  id: keyof HiddenGroups,
  name: string,
  location: string,
  isActive: boolean,
  checked: boolean,
  // TODO
  // prevRequest: null,
  prevRequest: any,
  groups: IGroups,
  allVacancies?: Array<Vacancy>
}

export type Regions = Array<Region>;

interface NewInDaysItem {
  value: number,
  label: string,
  checked: boolean,
}

interface Experience {
  id: string,
  modifier: string,
  name: string,
  checked: boolean,
}

export type NewInDays = Array<NewInDaysItem>

export type KeywordTypes = 'necessary' | 'unnecessary'

export type Necessary = Array<string>
export type Unnecessary = Array<string>

export interface Keywords {
  necessary: Necessary,
  unnecessary: Unnecessary,
}
export interface Form extends Keywords {
  name: string,
  newInDays: NewInDays,
  experience: Array<Experience>,
}

export interface DefaultSearchParams extends Form {
  // TODO
  regions: Regions | any
}

export type Favorites = Array<string>;
export type Blacklist = Array<string>;

export interface imprintFav {
  id: string,
  vacancies: Array<Vacancy>
}

export type ShowArchived = boolean;

export interface AppInitState {
  showAlert: boolean,
  // TODO
  favorites: Favorites | any,
  blacklist: Blacklist | any,
  hiddenGroups: HiddenGroups | any,
  // TODO
  imprintFav: Array<imprintFav> | any,
  showLoader: boolean,
  usdCurrency: boolean,
  minSalary: number | null,
  showArchived: ShowArchived,
}

export interface AppState {
  app: Partial<AppInitState>
}

export type FormInitState = Partial<DefaultSearchParams>
