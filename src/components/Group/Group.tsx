import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Group.module.scss';
import { Company } from '../Company';
import { FindSome, GroupProps } from './Group.types';
import { AppState } from '../../types/initialParams.types';

function Group({ companies, name }: GroupProps) {
  const showArchived: any = useSelector(({ app }: AppState) => app.showArchived);

  const findSome: FindSome = (company, param) => company.vacancies.some((vacancy) => vacancy[param]);

  return (
    <div className={styles.items} key={name}>
      {companies.map((company) => !findSome(company, 'isDel')
        && Boolean(company.vacancies.length)
        && (company.vacancies.length !== company.archived?.length || showArchived)
        && (
          <Company
            company={company}
            key={company.id}
          />
        ))}
    </div>
  );
}

export default Group;
