import React from 'react';
import ItemsList from './ItemsList';

const GROUP_NAMES = {
    is_fav: 'Избранные вакансии',
    is_new: 'Новые вакансии',
    is_jun: 'Вакансии для начинающих',
    salary: 'Вакансии с указанным окладом',
    default: 'Без дополнительных параметров',
}

export default function ItemsInner(props) {

    let groupClassName = 'items-group';

    if(props.itemsList.name === 'salary')
        groupClassName += ' items-group__salary';

    return (
        <div className={ groupClassName }>
            <h3 className="items-group__name">{ GROUP_NAMES[props.itemsList.name] }:</h3>
            <ItemsList items={ props.itemsList.items }
                       handleClickAction={ props.handleClickAction } />
        </div>
    );
}
