import { Section } from '../Section/Section.types';
import { AppInitState, SectionId } from '../../types/initialParams.types';

export interface SectionTitleState {
  activeTitleId: string,
  section: Section,
}

export interface SectionTitleProps {
  section: Section,
  isActiveSection: boolean,
  loading: number,
  changeActiveSection: (sectionId: SectionId) => void,
}

export interface AppState {
  app: AppInitState
}
