import React from 'react';
import { connect } from 'react-redux';
import { toggleGroupVisibility } from '../../redux/actions/regions';
import styles from './GroupsVisibility.module.scss';
import { GroupsVisibilityProps } from './GroupsVisibility.types';

function GroupsVisibility({
  groupsEntries,
  sectionId,
  toggleGroupVisibility,
}: GroupsVisibilityProps) {
  return (
    <div className={styles.filter}>
      <div className={styles.title}>Отображение групп:</div>
      {groupsEntries.map(([groupId, group]) => (group?.companies.length > 0)
      && (
        <button
          type="button"
          className={group.isHidden ? styles.filterItem : styles.filterItemActive}
          onClick={() => toggleGroupVisibility(sectionId, groupId)}
          key={groupId}
        >
          {group.name}
        </button>
      ))}
    </div>
  );
}

const mapDispatchToProps = {
  toggleGroupVisibility,
};

export default connect(null, mapDispatchToProps)(GroupsVisibility);
