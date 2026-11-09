import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styles from './Section.module.scss';
import { declOfNum } from '../../helpers';
import { loadData } from '../../redux/actions/regions';
import { openAuth } from '../../redux/actions/app';
import { Groups } from '../Groups';
import { GroupsVisibility } from '../GroupsVisibility';
import { SectionProps } from './Section.types';
import { hasHhToken } from '../../api/hh';

function Section({
  section, experience, loadData, groupsEntries, loading, minSalary, authError, openAuth,
}: SectionProps) {
  useEffect(() => {
    if (hasHhToken() && !section.allVacancies?.length) {
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

  const renderAuthRequired = () => (
    <div className={styles.authRequired}>
      <h3>{authError || 'Для загрузки вакансий нужен токен hh.ru'}</h3>
      <p>
        API hh.ru требует авторизацию. Укажите токен приложения из личного кабинета
        {' '}
        <a href="https://dev.hh.ru/admin" target="_blank" rel="noopener noreferrer">
          dev.hh.ru
        </a>
        .
      </p>
      <button
        type="button"
        className={styles.authButton}
        onClick={() => openAuth()}
      >
        Указать токен
      </button>
    </div>
  );

  const renderContent = () => {
    if (!hasHhToken() || authError) {
      return renderAuthRequired();
    }

    if (!section.allVacancies || loading) {
      return renderLoading();
    }

    return [
      renderGroupsToggle(),
      renderGroups(),
    ];
  };

  const alertText = () => {
    const allVacancies = section.allVacancies.length;
    const declension = declOfNum(allVacancies, [
      ['найдена', 'вакансия', 'скрыта'],
      ['найдено', 'вакансии', 'скрыты'],
      ['найдено', 'вакансий', 'скрыты'],
    ]);

    return allVacancies
      ? `По вашему запросу ${declension[0]} ${allVacancies} ${declension[1]} 
      но ${declension[2]} из-за "ключевых слов"
      ${section.vacancies?.length > 0 ? ' / "отображения групп"' : ''}
      ${minSalary ? ' / "фильтрации по ЗП"' : ''}`
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
        {renderContent()}
      </div>
    </section>
  );
}

const mapStateToProps = ({ form, app }: any, { section }: any) => ({
  section,
  loading: app.loading,
  minSalary: app.minSalary,
  authError: app.authError,
  groupsEntries: Object.entries(section.groups),
  experience: form.experience,
});

const mapDispatchToProps = {
  loadData,
  openAuth,
};

export default connect(mapStateToProps, mapDispatchToProps)(Section);
