import { IGroups } from '../components/Groups/Groups.types';
import { imprintFav, Regions } from './initialParams.types';

export type SetLocalStorage = (key: string, payload: any) => void;

export type GetLocalStorage = (key: string) => any;

export type IsObjectsEqual = (arr1: Array<any>, arr2: Array<any>) => boolean;

// export type GetDataFromStorage = (type: string, regions?: Regions) => Array<any> | object;
export type GetDataFromStorage = (type: string, regions?: Regions) => any;

export type FindClosestNewInDays = (value: Date) => number;

// TODO Generics
// export type CloneObj<T extends Object> = (arg: T) => T;
export type CloneObj = (arg: any) => any;

export type DeclOfNum = (number: number, words: Array<Array<string>>) => Array<string>;

export type ParseDateString = (dateString: string) => Date;

export interface Exp {
  id: string,
  modifier: keyof IGroups,
  name: string,
  checked: boolean
}
export type Experience = Array<Exp>

export type CreateimprintFav = (regions: Regions) => Array<imprintFav>;
