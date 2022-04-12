import { KeywordField } from './KeywordFields/KeywordFields.types';

export const KEYWORD_FIELDS_DATA: Array<KeywordField> = [
  {
    id: 'necessary',
    label: 'Добавить ключевое слово',
    itemsTitle: 'Ключевые слова',
    placeholder: 'js',
    tooltip: 'Название вакансии или работодателя будут содержать хотя-бы одно из ключевых слов',
  },
  {
    id: 'unnecessary',
    label: 'Добавить исключающее слово',
    itemsTitle: 'Исключить слова',
    placeholder: 'php',
    tooltip: 'Названия вакансий с данным словом будут скрыты',
  },
];

export const REQUIRED_FIELD_TOOLTIP: string = 'Обязательно для заполнения';
