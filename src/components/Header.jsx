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
        text: 'Вернуть скрытые вакансии',
        actionType: 'blacklist',
    },
]

export default function Header(props) {

    return (
        <header>
            <div className={ styles.actions }>
                <button type="button"
                        onClick={ props.showAlert }
                        className={ styles['show-alert'] }
                        title="Показать описание">!</button>

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
            </div>
        </header>
    );
}
