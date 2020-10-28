import React from 'react';
import styles from '../../styles/components/Items/ItemsInner.module.scss';
import ItemsList from './ItemsList';

const GROUP_NAMES = {
    is_fav: 'Избранное',
    is_new: 'Новые вакансии',
    is_jun: 'Вакансии для начинающих',
    is_salary: 'Вакансии с указанным окладом',
    default: 'Без дополнительных параметров',
}

export default function ItemsInner(props) {

    return (
        <div className={ styles[props.itemsList.name] }>
            <h3 className={ styles.title }>{ GROUP_NAMES[props.itemsList.name] }:</h3>
            <ItemsList items={ props.itemsList.items }
                       handleClickAction={ props.handleClickAction } />
        </div>
    );
}
