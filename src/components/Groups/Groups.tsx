import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Groups.module.scss';
import { Group } from '../Group';
import { GroupsProps } from './Groups.types';
import { AppState, GroupNames } from '../../types/initialParams.types';
import { IGroup } from '../Group/Group.types';

function Groups({ groupsEntries }: GroupsProps) {
  const showArchived: any = useSelector(({ app }: AppState) => app.showArchived);

  const displayGroup = (group: IGroup) => {
    if (group.name === GroupNames.isFav) {
      const haveVisible = group.companies.some((company) => company.vacancies.length
        && company.vacancies.length !== company.archived?.length);

      return haveVisible || showArchived;
    }

    return true;
  };

  return (
    <>
      {groupsEntries.map(([groupName, group]) => (Boolean((!group.isHidden && group.companies?.length))
        && (
          <div
            className={styles[groupName]}
            key={group.name}
          >
            <h3 className={styles.title}>{group.name}</h3>
            {displayGroup(group)
              ? <Group companies={group.companies} key={group.name} name={group.name} />
              : <h4>Все избранные компании / вакансии находятся в архиве :(</h4>}
          </div>
        )
      ))}
    </>
  );
}

export default Groups;
