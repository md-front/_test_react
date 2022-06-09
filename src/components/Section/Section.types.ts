import { Experience } from '../../types/initialParams.types';

export type Section = any

export interface SectionProps {
    section: Section,
    experience: Array<Experience>,
    groupsEntries: any,
    loadData: any,
    loading: number,
    // toggleGroupVisibility: any,
}
