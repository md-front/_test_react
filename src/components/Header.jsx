import React from 'react';
import {ReactComponent as More} from '../assets/search-more.svg'
import styles from '../styles/components/Header.module.scss';

const btns = [
    {
        className: 'fav',
        disableClassName: 'fav-disabled',
        disableName: 'isFavActive',
        text: 'Очистить избранное',
        actionType: 'favorites',
    },
    {
        className: 'del',
        disableClassName: 'del-disabled',
        disableName: 'isDelActive',
        text: 'Отобразить скрытые вакансии',
        actionType: 'blacklist',
    },
]

export default function Header(props) {

    return (
        <header>
            <div className="container">

                <div className={styles.actions}>
                    <h1 className={styles.title}>Поиск вакансий</h1>

                    <div className={styles.btns}>
                        {btns.map((btn, index) =>
                            <button type="button"
                                    key={index}
                                    className={props[btn.disableName] ? styles[btn.className] : styles[btn.disableClassName]}
                                    onClick={() => props.clearItems(btn.actionType)}>
                                {btn.text}
                            </button>
                        )}
                    </div>
                </div>

                <form className={styles['form']} onSubmit={e => e.preventDefault()} title="work in progress">
                    <div className={styles['form__inner']}>
                        <input className={styles['form__input']}
                               type="text"
                               placeholder="Frontend"
                               defaultValue="Frontend"
                               disabled/>
                        <button className={styles['form__btn']}
                                type="submit"
                                disabled>Найти</button>
                    </div>

                    <button type="button"
                            className={styles['form__more']}
                            disabled>
                        <More/>
                    </button>
                </form>
            </div>
        </header>
    );
}
