export interface Group {
  name: string,
  sortValue: number,
  isHidden: boolean,
  companies: Array<any>
}
export interface Groups {
  isFav: Group,
  isNew: Group,
  exp6: Group,
  exp3: Group,
  isJun: Group,
  isSalary: Group,
  default: Group,
}

// type HiddenGroup = Array<keyof Groups>;
type HiddenGroup = Array<any>;

export type HiddenGroups = {
  msk: HiddenGroup,
  spb: HiddenGroup,
  ekb: HiddenGroup,
  remote: HiddenGroup
};

interface Region {
  id: keyof HiddenGroups,
  name: string,
  location: string,
  isActive: boolean,
  checked: boolean,
  // TODO
  // prevRequest: null,
  prevRequest: any,
  groups: Groups,
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

export interface DefaultSearchParams {
  name: string,
  necessary: Array<string>,
  unnecessary: Array<string>,
  newInDays: Array<NewInDays>,
  experience: Array<Experience>,
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

export type FormInitState = Partial<DefaultSearchParams>
