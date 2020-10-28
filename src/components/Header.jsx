import React from 'react';
import styles from '../styles/components/Header.module.scss';
import fav from '../assets/star.svg';
import del from '../assets/del.svg';

const btns = [
    {
        img: fav,
        className: 'fav',
        disableClassName: 'fav-disabled',
        disableName: 'isFavActive',
        text: 'Очистить избранное',
        actionType: 'favorites',
    },
    {
        img: del,
        className: 'del',
        disableClassName: 'del-disabled',
        disableName: 'isDelActive',
        text: 'Очистить скрытые вакансии',
        actionType: 'blacklist',
    },
]

export default function(props) {

    return (
        <header>
            <div className={ styles.btns }>
                { btns.map((btn, index) =>
                    <button type="button"
                            key={ index }
                            className={ props[btn.disableName] ? styles[btn.className] : styles[btn.disableClassName] }
                            onClick={ () => props.clearItems(btn.actionType) }>
                        { btn.text }
                        <img src={ btn.img }/>
                    </button>
                )}
            </div>
        </header>
    );
}
