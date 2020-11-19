import React from 'react';
import styles from '../../styles/components/Items/ItemsGroup.module.scss';
import ItemsList from './ItemsList';

const ItemsGroup = props => (
    props.groupsEntries.map(([groupName,group],index) =>
        (group.items && group.items.length && !group.is_hidden) ?
            <div className={styles[groupName]}
                 key={index}>
                <h3 className={styles.title}>{group.name}</h3>
                <ItemsList items={group.items}/>
            </div>
            :
            ''
    )
)

export default ItemsGroup;