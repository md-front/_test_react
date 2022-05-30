import { NEW_IN_DAYS } from './constants/common';
import {
  CloneObj, DeclOfNum,
  FindClosestNewInDays,
  GetDataFromStorage, GetLocalStorage, IsObjectsEqual, ParseDateString, SetLocalStorage,
} from './types/common.types';

/* Storage actions */
export const setLS: SetLocalStorage = (key, payload) => localStorage.setItem(key, JSON.stringify(payload));
// TODO
// @ts-ignore
window.setLS = setLS;
// export const getLS: GetLocalStorage = (key) => JSON.parse(localStorage.getItem(key) || '{}');
// @ts-ignore
export const getLS: GetLocalStorage = (key) => JSON.parse(localStorage.getItem(key));
// TODO
// @ts-ignore
window.getLS = getLS;

export const getDataFromStorage: GetDataFromStorage = (type: string, regions) => {
  let result = getLS(type);

  if (!result && regions) {
    const hiddenGroups = {};

    regions.forEach((section) => {
      // @ts-ignore TODO
      hiddenGroups[section.id] = [];
    });

    result = hiddenGroups;
  }

  if (!result/* || typeof(result[0]) !== 'string' */) {
    return [];
  }

  return result;
};

export const findClosestNewInDays: FindClosestNewInDays = (value) => {
  const result = NEW_IN_DAYS.reduce((closest, item) => {
    const currentDiff = Math.abs(value - item.value);
    if (currentDiff <= closest.diff) {
      return {
        value: item.value,
        diff: currentDiff,
      };
    }

    return closest;
  }, {
    value: NEW_IN_DAYS[0].value,
    diff: value - NEW_IN_DAYS[0].value,
  });

  return result.value;
};

/*  Objects actions */
export const isObjectsEqual: IsObjectsEqual = (arr1, arr2) => JSON.stringify(arr1) === JSON.stringify(arr2);
export const cloneObj: CloneObj = (arg) => JSON.parse(JSON.stringify(arg));

/* Склонение от числового значения, формат: (1, ['минута', 'минуты', 'минут'])  */
export const declOfNum: DeclOfNum = (number, words) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
};

export const parseDateString: ParseDateString = (dateString) => {
  const arr = dateString.split(/\D/);
  // @ts-ignore TODO
  return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
};
