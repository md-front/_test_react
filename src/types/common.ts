import { Regions } from './initialParams';

export type SetLocalStorage = (key: string, payload: string) => void;

export type GetLocalStorage = (key: string) => object | Array<any> | null;

export type IsObjectsEqual = (arr1: Array<any>, arr2: Array<any>) => boolean;

export type GetDataFromStorage = (type: string, regions?: Regions) => object | Array<any>;

// TODO Generics
export type CloneObj = (obj: object) => object;

export type DeclOfNum = (number: number, words: Array<string>) => string;

export type ParseDateString = (dateString: string) => Date;
