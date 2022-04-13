import { KeywordTypes } from '../../../types/initialParams.types';
import { KeywordField } from '../KeywordFields/KeywordFields.types';

export interface KeywordListProps {
    keywordType: KeywordField,
    keywordsList: Array<string>,
    deleteKeyword: (id: KeywordTypes, keyWord: string) => void
}
