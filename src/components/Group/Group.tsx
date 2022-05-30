import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Group.module.scss';
import { Company } from '../Company';
import { FindSome, GroupProps } from './Group.types';

function Group({ companies, name }: GroupProps) {
  // @ts-ignore TODO
  const showArchived: any = useSelector((state) => state.app.showArchived);

  const findSome: FindSome = (company, param) => company.vacancies.some((vacancy) => vacancy[param]);

  return (
    <div className={styles.items} key={name}>
      {companies.map((company) => !findSome(company, 'isDel')
        && !!company.vacancies.length
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
