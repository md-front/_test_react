import React from 'react';

export default function ItemsTitle(props) {

    let className = "section__title";
    className += props.isActive ? ' active' : '';

    function handleClick() {

        if(!props.isActive)
            props.handleClick(props.section.id);
    }

    return (
        <div className={ className }
             onClick={ handleClick }>
            { props.isActive ?
                <h1>{ props.section.name }: <span>{ props.quantity > 0 ? props.quantity : '..' }</span></h1>
                :
                <h1>{ props.section.name }</h1>
            }
        </div>
    );
}
