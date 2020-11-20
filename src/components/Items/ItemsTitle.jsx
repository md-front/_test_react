import React from 'react';
import styles from '../../styles/components/Items/ItemsTitle.module.scss';
import {changeActiveSection} from "../../redux/actions/regions";
import {connect} from "react-redux";

const ItemsTitle = ({section, changeActiveSection}) => (
    <div className={section.is_active ? styles.active : styles.title}
         onClick={() => !section.is_active ? changeActiveSection(section.id) : ''}>
        <div data-text={section.name}>{section.name}</div>
        {/* TODO section.visibleVacancies */}
        {(section.is_active || section.groups) &&
            <span>{section.visibleVacancies ? section.visibleVacancies : '...'}</span>
        }
    </div>
)

const mapDispatchToProps = {
    changeActiveSection
}

export default connect(null, mapDispatchToProps)(ItemsTitle)