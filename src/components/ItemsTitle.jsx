import React from 'react';

export default function ItemsTitle(props) {

    return (
        <h1>{ props.title }: <span>{ props.quantity >= 0 ? props.quantity : '...' }</span></h1>
    );
}
