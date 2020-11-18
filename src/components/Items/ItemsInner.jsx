import React from 'react';
import styles from '../../styles/components/Items/ItemsInner.module.scss';
import ItemsList from './ItemsList';

const ItemsInner = ({itemsList, handleClickAction}) => (
    <div className={styles[itemsList.name]}>
        <h3 className={styles.title}>{window.GROUP_NAMES[itemsList.name]}</h3>
        <ItemsList items={itemsList.items}
                   handleClickAction={handleClickAction} />
    </div>
)

export default ItemsInner;