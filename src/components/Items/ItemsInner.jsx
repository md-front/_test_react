import React from 'react';
import styles from '../../styles/components/Items/ItemsInner.module.scss';
import ItemsList from './ItemsList';

export default function ItemsInner(props) {

    return (
        <div className={ styles[props.itemsList.name] }>
            <h3 className={ styles.title }>{ window.GROUP_NAMES[props.itemsList.name] }:</h3>
            <ItemsList items={ props.itemsList.items }
                       handleClickAction={ props.handleClickAction } />
        </div>
    );
}
