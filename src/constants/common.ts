import { NewInDays } from '../types/initialParams.types';

export const JUNIOR = /junior|стажер|младший|помощник/i;

export const NEW_IN_DAYS: NewInDays = [
  {
    value: 1,
    label: '1 день',
    checked: false,
  },
  {
    value: 2,
    label: '2 дня',
    checked: true,
  },
  {
    value: 3,
    label: '3 дня',
    checked: false,
  },
  {
    value: 7,
    label: '1 неделю',
    checked: false,
  },
  {
    value: 14,
    label: '2 недели',
    checked: false,
  },
];
