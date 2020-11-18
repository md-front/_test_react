import React from 'react';
import styles from '../../styles/components/Items/ItemsList.module.scss';
import ItemsItem from './ItemsItem';

const ItemsList = ({items, handleClickAction}) => (
    <div className={styles.items}>
        {items.map((item, index) =>
            item.haveVisibleItem &&
            <ItemsItem item={item}
                       key={index}
                       handleClickAction={handleClickAction} />
        )}
    </div>
)

export default ItemsList