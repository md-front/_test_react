import { Btn } from './Header.types';

export const BUTTONS_DATA: Array<Btn> = [
  // {
  //   type: 'imprintFav',
  //   className: 'arch',
  //   disableClassName: 'arch-disabled',
  //   text: 'Очистить архив',
  //   tip: 'Старые данные удалены',
  // },
  {
    type: 'favorites',
    className: 'fav',
    disableClassName: 'fav-disabled',
    text: 'Очистить избранное',
    tip: '',
  },
  {
    type: 'blacklist',
    className: 'del',
    disableClassName: 'del-disabled',
    text: 'Отобразить скрытые вакансии',
    tip: '',
  },
];
