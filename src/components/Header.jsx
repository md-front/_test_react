import React from 'react';
import fav from '../assets/star.svg';
import del from '../assets/del.svg';

const btns = [
    {
        img: fav,
        text: 'Очистить избранное',
        actionType: 'favorites',
    },
    {
        img: del,
        text: 'Очистить скрытые вакансии',
        actionType: 'blacklist',
    },
]

export default function(props) {

    return (
        <header>
            { btns.map((btn, index) =>
                <button type="button"
                        key={index}
                        className="clear"
                        onClick={() => props.clearItems(btn.actionType)}>
                    { btn.text }
                    <img src={ btn.img }/>
                </button>
            )}
        </header>
    );
}
