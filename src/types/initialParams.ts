// type HiddenGroup = Array<keyof Groups>;
import { IGroups } from '../components/Groups/Groups.types';
import { Vacancy } from '../components/Vacancy/Vacancy.types';

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

interface NewInDays {
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

export type Regions = Array<Region>;

export type KeywordTypes = 'necessary' | 'unnecessary'

export interface Form {
  name: string,
  necessary: Array<string>,
  unnecessary: Array<string>,
  newInDays: Array<NewInDays>,
  experience: Array<Experience>,
}

export interface DefaultSearchParams extends Form {
  // TODO
  regions: Regions | any
}

export type Favorites = Array<string>;
export type Blacklist = Array<string>;

export interface AppInitState {
  showAlert: boolean,
  // TODO
  favorites: Favorites | any,
  blacklist: Blacklist | any,
  hiddenGroups: HiddenGroups | any,
  showLoader: boolean,
  usdCurrency: boolean,
}

export interface AppState {
  app: Partial<AppInitState>
}

export type FormInitState = Partial<DefaultSearchParams>
