/** Storage actions */
export const setLS = (key, payload) => localStorage.setItem(key, JSON.stringify(payload));
export const getLS = key => JSON.parse(localStorage.getItem(key));
export const getDataFromStorage = (type, regions) => {
    let result = getLS(type)

    if(!result && regions) {
        const hiddenGroups = {};

        for(let section of regions)
            hiddenGroups[section.id] = []

        result = hiddenGroups;
    }

    if(!result/* || typeof(result[0]) !== 'string'*/)
        return [];

    return result;
};

/**  Objects actions */
export const isObjectsEqual = (arr1, arr2) => JSON.stringify(arr1) === JSON.stringify(arr2);
export const cloneObj = obj => JSON.parse(JSON.stringify(obj));

/** Склонение от числового значения, формат: (1, ['минута', 'минуты', 'минут'])  */
export const declOfNum = (number, words) => {
    const cases = [2, 0, 1, 1, 1, 2];
    return words[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  }

export const parseDateString = dateString => {
    const arr = dateString.split(/\D/);
    return new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
}