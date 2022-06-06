import { Section } from '../Section/Section.types';

export interface SectionTitleState {
  activeTitleId: string,
  section: Section,
}

export interface SectionTitleProps {
  section: Section,
  isActiveSection: boolean,
  loading: number,
  // TODO sectionId
  changeActiveSection: (sectionId: any) => void,
}
