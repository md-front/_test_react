module.exports = {

    /** Storage Actions */
    setLS(key, payload) {
        return localStorage.setItem(key, JSON.stringify(payload))
    },
    getLS(key) {
        return JSON.parse(localStorage.getItem(key))
    },

    /**  Sort */
    sortByReduction(arr, param) {
        return arr.sort((a,b) => b[param] - a[param]);
    },
    sortByIncreasing(arr, param) {
        return arr.sort((a,b) => a[param] - b[param]);
    },
    isObjectsEqual(arr1, arr2) {
        return JSON.stringify(arr1) === JSON.stringify(arr2)
    },
    cloneObj(obj) {
        return JSON.parse(JSON.stringify(obj))
    },

    /**  Date */
    parseDateString(dateString) {
        const arr = dateString.split(/\D/);
        return new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
    },

    /** Check */
    checkItems(arr, param, state = true) {
        return arr && arr.some(element => state ? element[param] : !element[param])
    }
}