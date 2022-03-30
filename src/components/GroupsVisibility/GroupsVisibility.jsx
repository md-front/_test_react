import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleGroupVisibility } from '../../redux/actions/regions';
import styles from './GroupsVisibility.module.scss';

function GroupsVisibility(props) {
  return (
    <div className={styles.filter}>
      <div className={styles.title}>Отображение групп:</div>
      {props.groupsEntries.map(([groupId, group], index) => (group.companies && group.companies.length > 0)
                && (
                <button
                  type="button"
                  className={group.isHidden ? styles.filterItem : styles.filterItemActive}
                  onClick={() => props.toggleGroupVisibility(props.sectionId, groupId)}
                  key={index}
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

GroupsVisibility.propTypes = {
  groupsEntries: PropTypes.array.isRequired,
};

export default connect(null, mapDispatchToProps)(GroupsVisibility);
