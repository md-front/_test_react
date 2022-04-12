import React from 'react';
import styles from './Group.module.scss';
import { Company } from '../Company';
import { GroupProps } from './Group.types';

function Group({ companies, name }: GroupProps) {
  return (
    <div className={styles.items} key={name}>
      {companies.map((company) => company.vacancies.some((vacancy) => !vacancy.isDel)
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
