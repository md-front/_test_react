import React from 'react';
import { connect } from 'react-redux';
import styles from './Company.module.scss';
import { Vacancy } from '../Vacancy';
import { toggleFavorite } from '../../redux/actions/app';
import { AppProps, CompanyProps, CompanyWrap } from './Company.types';

function Company({
  showArchived, company, toggleFavorite,
}: CompanyProps) {
  const logoUrl = company.vacancies[0]?.employer.logoUrl;

  return (
    <div className={company.vacancies.length !== company.archived?.length ? styles.item : styles.itemArchived}>
      <div
        className={styles.title}
        onClick={() => toggleFavorite(company.id)}
        title="В избранное"
      >
        <h2>{company.name}</h2>

        {logoUrl && <img src={logoUrl} alt="logo" />}
      </div>

      {company.vacancies.map((vacancy) => !vacancy.isDel && (!vacancy.archived || showArchived)
        && (
          <Vacancy
            vacancy={vacancy}
            key={vacancy.id}
          />
        ))}

    </div>
  );
}

// eslint-disable-next-line no-empty-pattern
const mapStateToProps = (
  { app: { showArchived } }: AppProps,
  { company }: CompanyWrap,
) => ({
  showArchived,
  company,
});

const mapDispatchToProps = {
  toggleFavorite,
};

export default connect(mapStateToProps, mapDispatchToProps)(Company);
