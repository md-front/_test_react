import { KeywordTypes } from '../../../types/initialParams';

export interface KeywordField {
    label: string,
    id: KeywordTypes,
    itemsTitle: string,
    placeholder: string,
    tooltip: string,
}
export type KeywordFieldsData = Array<KeywordField>
