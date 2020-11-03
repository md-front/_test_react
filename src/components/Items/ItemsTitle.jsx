import React from 'react';
import styles from '../../styles/components/Items/ItemsTitle.module.scss';

export default function ItemsTitle(props) {

    const section = props.section;

    function handleClick() {

        if(!section.is_active)
            props.handleClick(section.id);
    }

    return (
        <div className={section.is_active ? styles.active : styles.title}
             onClick={handleClick}>
            <div data-text={section.name}>{section.name}</div>
            {(section.is_active || section.groups) &&
            <span>{section.visibleVacancies > 0 ? section.visibleVacancies : '...'}</span>
            }
        </div>
    );
}
