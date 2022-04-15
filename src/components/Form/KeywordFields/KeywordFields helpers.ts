import { CheckKeywordInList } from './KeywordFields.types';

// eslint-disable-next-line max-len
export const checkKeywordInList: CheckKeywordInList = (keywordList, newKeyword) => keywordList.some((keyword) => keyword.toLowerCase() === newKeyword.toLowerCase());
