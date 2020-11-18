import React from 'react';
import styles from '../../styles/components/Items/ItemsTitle.module.scss';

const ItemsTitle = ({section, handleClick}) => (
    <div className={section.is_active ? styles.active : styles.title}
         onClick={() => !section.is_active ? handleClick(section.id) : ''}>
        <div data-text={section.name}>{section.name}</div>
        {(section.is_active || section.groups) &&
        <span>{section.visibleVacancies > 0 ? section.visibleVacancies : '...'}</span>
        }
    </div>
)

export default ItemsTitle