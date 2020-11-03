import React from 'react';
import styles from '../../styles/components/Items/ItemsList.module.scss';
import ItemsItem from './ItemsItem';

export default function ItemsList(props) {

    return (
        <div className={styles.items}>
            {props.items.map((item, index) =>
                item.haveVisibleItem &&
                <ItemsItem item={item}
                           key={index}
                           handleClickAction={props.handleClickAction} />
            )}
        </div>
    );
}
