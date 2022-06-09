import React from 'react';
import { connect } from 'react-redux';
import styles from './SectionTitle.module.scss';
import { changeActiveSection } from '../../redux/actions/regions';
import { SectionTitleProps, SectionTitleState, AppState } from './SectionTitle.types';

function SectionTitle({
  section, isActiveSection, changeActiveSection, loading,
}: SectionTitleProps) {
  const Vacancies = section.visibleVacancies ? section.visibleVacancies : '...';

  return (
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

export default connect(mapStateToProps, mapDispatchToProps)(SectionTitle);
