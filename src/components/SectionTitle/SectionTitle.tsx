import React from 'react';
import { connect } from 'react-redux';
import styles from './SectionTitle.module.scss';
import { changeActiveSection } from '../../redux/actions/regions';
import { AppState } from '../../types/initialParams.types';
import { SectionTitleProps, SectionTitleState } from './SectionTitle.types';

function SectionTitle({
  section, isActiveSection, changeActiveSection, loading,
}: SectionTitleProps) {
  const Vacancies = section.visibleVacancies ? section.visibleVacancies : '...';

  return (
    // TODO
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={isActiveSection ? styles.active : styles.title}
      style={(!isActiveSection && loading) ? { pointerEvents: 'none' } : {}}
      onClick={() => ((!isActiveSection && !loading) ? changeActiveSection(section.id) : '')}
    >
      <div data-text={section.name}>{section.name}</div>
      <span>
        {isActiveSection && loading
          ? '...'
          : Vacancies}
      </span>
    </div>
  );
}

const mapStateToProps = ({ app }: AppState, { section, activeTitleId }: SectionTitleState) => ({
  section,
  isActiveSection: section.id === activeTitleId,
  loading: app.loading,
});

const mapDispatchToProps = {
  changeActiveSection,
};

// @ts-ignore TODO
export default connect(mapStateToProps, mapDispatchToProps)(SectionTitle);
