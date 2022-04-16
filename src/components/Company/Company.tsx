import React from 'react';
import { connect } from 'react-redux';
import styles from './Company.module.scss';
import { Vacancy } from '../Vacancy';
import { toggleFavorite } from '../../redux/actions/app';
import { CompanyProps, CompanyWrap } from './Company.types';

function Company({ company, toggleFavorite }: CompanyProps) {
  const logoUrl = company.vacancies[0]?.employer.logo_urls;

  return (
    <div className={styles.item}>
      <div
        className={styles.title}
        onClick={() => toggleFavorite(company.id)}
        title="В избранное"
      >
        <h2>{company.name}</h2>

        {logoUrl && <img src={logoUrl['90']} alt="logo" />}
      </div>

      {company.vacancies.map((vacancy) => !vacancy.isDel
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
const mapStateToProps = ({ }: any, { company }: CompanyWrap) => ({
  company,
});

const mapDispatchToProps = {
  toggleFavorite,
};

export default connect(mapStateToProps, mapDispatchToProps)(Company);
