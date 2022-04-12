import { IGroups } from '../components/Groups/Groups.types';
import { Regions } from './initialParams';

export type SetLocalStorage = (key: string, payload: string) => void;

export type GetLocalStorage = (key: string) => object | Array<any> | null;

export type IsObjectsEqual = (arr1: Array<any>, arr2: Array<any>) => boolean;

export type GetDataFromStorage = (type: string, regions?: Regions) => Array<any> | object;

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