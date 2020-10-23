import React from 'react';
import ItemsItem from './ItemsItem';

export default function ItemsList(props) {

    return (
        <div className="items">
            { props.items.map((item, index) =>
                item.haveVisibleItem ?
                    <ItemsItem item={ item }
                               key={ index }
                               handleClickAction={ props.handleClickAction } />
                    :
                    ''
            ) }
        </div>
    );
}
