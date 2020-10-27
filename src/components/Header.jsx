import React from 'react';
import fav from '../assets/star.svg';
import del from '../assets/del.svg';

const btns = [
    {
        img: fav,
        disableName: 'isFavActive',
        text: 'Очистить избранное',
        actionType: 'favorites',
    },
    {
        img: del,
        disableName: 'isDelActive',
        text: 'Очистить скрытые вакансии',
        actionType: 'blacklist',
    },
]

export default function(props) {

    return (
        <header>
            <div className="btns">
                { btns.map((btn, index) =>
                    <button type="button"
                            key={index}
                            className={`clear${ !props[btn.disableName] ? ' disabled' : ''}`}
                            onClick={() => props.clearItems(btn.actionType)}>
                        { btn.text }
                        <img src={ btn.img }/>
                    </button>
                )}
            </div>
        </header>
    );
}
