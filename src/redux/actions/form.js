import * as types from '../types/form';
import { changeSelectedRegions, filterVacancies } from './regions';

export const formSubmit = ({ name, experience, formRegions }) => (dispatch, getState) => {
  const { regions } = getState();

  // eslint-disable-next-line no-restricted-syntax
  for (const region of regions) {
    region.checked = formRegions.find((formRegion) => formRegion.id === region.id).checked;
  }

  dispatch({ type: types.FORM_SUBMIT, name, experience });
  dispatch(changeSelectedRegions(regions));
};
export const changeNewInDays = (value) => (dispatch, getState) => {
  console.log('changeNewInDays', value);
  const newInDays = [...getState().form.newInDays].map((option) => {
    // eslint-disable-next-line no-param-reassign
    option.checked = option.value === value;

    return option;
  });

  dispatch({ type: types.CHANGE_NEW_IN_DAYS, newInDays });
  dispatch(filterVacancies());
};
export const addKeyword = (keywordType, value) => (dispatch, getState) => {
  const keywords = [...getState().form[keywordType], value];

  dispatch({ type: types.CHANGE_KEYWORDS, keywordType, keywords });
  dispatch(filterVacancies());
};
export const deleteKeyword = (keywordType, value) => (dispatch, getState) => {
  const keywords = [...getState().form[keywordType]].filter((keyword) => keyword.toLowerCase() !== value.toLowerCase());

  dispatch({ type: types.CHANGE_KEYWORDS, keywordType, keywords });
  dispatch(filterVacancies());
};
export const clearKeywords = () => (dispatch) => {
  dispatch({ type: types.CLEAR_KEYWORDS });
  dispatch(filterVacancies());
};
