import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styles from './Section.module.scss';
import { declOfNum } from '../../helpers';
import { loadData } from '../../redux/actions/regions';
import { Groups } from '../Groups';
import { GroupsVisibility } from '../GroupsVisibility';
import { SectionProps } from './Section.types';

function Section({
  section, experience, loadData, groupsEntries, loading,
}: SectionProps) {
  useEffect(() => {
    if (!section.allVacancies?.length) {
      loadData(section);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderLoading = () => {
    const isFewExp = experience.filter((exp) => exp.checked).length > 1;

    return (
      <>
        <div className={styles.loader}><span style={{ width: `${loading}%` }} /></div>
        <h3 className={styles.loadingTitle}>
          Загрузка...
        </h3>
        {isFewExp && (
          <span className={styles.fewExpAlert}>(На группировку двух и более секций опыта потребуется больше времени)</span>
        )}
      </>
    );
  };

  const renderGroupsToggle = () => section.vacancies?.length > 0
    && (
      <GroupsVisibility
        sectionId={section.id}
        groupsEntries={groupsEntries}
        key={0}
      />
    );

  const alertText = () => {
    const allVacancies = section.allVacancies.length;
    const declension = declOfNum(allVacancies, [
      ['найдена', 'вакансия', 'скрыта'],
      ['найдено', 'вакансии', 'скрыты'],
      ['найдено', 'вакансий', 'скрыты'],
    ]);

    return allVacancies
      ? `По вашему запросу ${declension[0]} ${allVacancies} ${declension[1]} 
      но ${declension[2]} из-за "ключевых слов"${section.vacancies?.length > 0 ? ' или "отображения групп"' : ''}`
      : 'По вашему запросу вакансии не найдены, попробуйте изменить "название", "регион поиска" или добавить поля "опыта"';
  };

  const renderGroups = () => (section.visibleVacancies
    ? (
      <Groups
        groupsEntries={groupsEntries}
        key="renderGroups"
      />
    )
    : <h3 key="renderGroups">{alertText()}</h3>);

  return (
    <section className={styles.section}>
      <div className="container">
        {!section.allVacancies || loading
          ? renderLoading()
          : [
            renderGroupsToggle(),
            renderGroups(),
          ]}
      </div>
    </section>
  );
}

// TODO form section
const mapStateToProps = ({ form, app }: any, { section }: any) => ({
  section,
  loading: app.loading,
  groupsEntries: Object.entries(section.groups),
  experience: form.experience,
});

const mapDispatchToProps = {
  loadData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Section);
