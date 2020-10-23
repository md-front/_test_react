/* todo избавиться от файла, раскидать по компонентам? */
module.exports = {

    /** Storage Actions */
    setLS(key, payload) {
        return localStorage.setItem(key, JSON.stringify(payload))
    },
    getLS(key) {
        return JSON.parse(localStorage.getItem(key))
    },
}