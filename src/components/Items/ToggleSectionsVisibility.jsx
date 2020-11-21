import React from 'react';
import {connect} from "react-redux";
import {toggleSectionVisibility} from '../../redux/actions/regions'
import styles from '../../styles/components/Items/ToggleSectionsVisibility.module.scss';

const ToggleSectionsVisibility = props => (
    <div className={styles.filter}>
        <div className={styles.title}>Отображение групп:</div>
        {props.groupsEntries.map(([groupId,group],index) =>
            group.items && group.items.length > 0 &&
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

export default connect(null, mapDispatchToProps)(ToggleSectionsVisibility)
