import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {toggleSectionVisibility} from '../../redux/actions/regions'
import styles from '../../styles/components/Info/ToggleGroupsVisibility.module.scss';

const ToggleGroupsVisibility = props => (
    <div className={styles.filter}>
        <div className={styles.title}>Отображение групп:</div>
        {props.groupsEntries.map(([groupId,group],index) =>
            (group.companies && group.companies.length > 0) &&
                <button type="button"
                        className={group.is_hidden ? styles.filterItem : styles.filterItemActive}
                        onClick={() => props.toggleSectionVisibility(props.sectionId, groupId)}
                        key={index}>{group.name}</button>
        )}
    </div>
)

const mapDispatchToProps = {
    toggleSectionVisibility
}

ToggleGroupsVisibility.propTypes = {
    groupsEntries: PropTypes.array.isRequired
}

export default connect(null, mapDispatchToProps)(ToggleGroupsVisibility)
