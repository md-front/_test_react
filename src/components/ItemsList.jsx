import React from 'react';
import ItemsItem from './ItemsItem';

export default function ItemsList(props) {

    return (
        <div id="items-ekb" className="items">
            { props.items.map((item, index) =>
                <ItemsItem item={item}
                           key={index}
                           handleClickAction={props.handleClickAction} />
            ) }
        </div>
    );
}
