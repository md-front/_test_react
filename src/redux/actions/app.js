import * as types from '../types/app'

export const showAlert = (e) => dispatch => {
    e.stopPropagation();

    dispatch({ type: types.SHOW_ALERT });

    // console.log(temp())

    // document.addEventListener('click', alertClickOutside)
    // document.addEventListener('keydown', closeByEsc)
};

const alertClickOutside = () => {

}

export const hideAlert = () => ({ type: types.HIDE_ALERT });