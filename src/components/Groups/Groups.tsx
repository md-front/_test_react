import React from 'react';
import styles from './Groups.module.scss';
import { Group } from '../Group';
import { GroupsProps } from './Groups.types';

function Groups({ groupsEntries }: GroupsProps) {
  return (
    <div>
      {groupsEntries.map(([groupName, group]) => ((!group.isHidden && group.companies?.length)
        ? (
          <div
            className={styles[groupName]}
            key={group.name}
          >
            <h3 className={styles.title}>{group.name}</h3>
            <Group companies={group.companies} key={group.name} name={group.name} />
          </div>
        )
        // TODO
        // eslint-disable-next-line react/jsx-no-useless-fragment
        : <div key={group.name} />))}
    </div>
  );
}

export default Groups;
