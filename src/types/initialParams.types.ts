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

export type SectionId = keyof HiddenGroups;

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

export type UrlOption = Region | Experience

export type Regions = Array<Region>;

interface NewInDaysItem {
  value: number,
  label: string,
  checked: boolean,
}

export interface Experience {
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
  regions: Regions | any
}

export type Favorites = Array<string>;
export type Blacklist = Array<string>;

export interface imprintFav {
  id: string,
  vacancies: Array<Vacancy>
}

export type HaveArchived = boolean;
export type ShowArchived = boolean;
export type IsSalaryOnly = boolean;
type SalaryStatItem = [string, number];
export type SalaryStat = Array<SalaryStatItem>;

export interface AppInitState {
  showAlert: boolean,
  favorites: Favorites,
  blacklist: Blacklist,
  hiddenGroups: HiddenGroups,
  imprintFav: Array<imprintFav>,
  loading: number,
  usdCurrency: boolean,
  minSalary: number,
  haveArchived: HaveArchived,
  showArchived: ShowArchived,
  isSalaryOnly: IsSalaryOnly,
  salaryStat: SalaryStat
}

export type AppState = {
  app: Partial<AppInitState>,
  form: Partial<Form>,
  regions: Partial<Regions>,
}

export type FormInitState = Partial<DefaultSearchParams>
