import { CheckKeywordInList } from './KeywordFields.types';

export const checkKeywordInList: CheckKeywordInList = (keywordList, newKeyword) => {
  return keywordList.some((keyword) => keyword.toLowerCase() === newKeyword.toLowerCase());
};
