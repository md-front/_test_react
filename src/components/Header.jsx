import React from 'react';
import Form from './Form';
import styles from '../styles/components/Header.module.scss';
import {connect} from "react-redux";
import {clearList} from "../redux/actions/app";

const btns = [
    {
        type: 'favorites',
        className: 'fav',
        disableClassName: 'fav-disabled',
        text: 'Очистить избранное',
    },
    {
        type: 'blacklist',
        className: 'del',
        disableClassName: 'del-disabled',
        text: 'Отобразить скрытые вакансии',
    },
]

const Header = props => (
    <header>
        <div className="container">

            <div className={styles.actions}>
                <a href={window.location.origin + window.location.pathname}
                   className={styles.rootLink}
                   title="Применить стандартный поиск">
                    <h1 className={styles.title}>Поиск вакансий</h1>
                </a>

                <div className={styles.btns}>
                    {btns.map((btn, index) =>
                        <button type="button"
                                key={index}
                                className={props[btn.type].length ? styles[btn.className] : styles[btn.disableClassName]}
                                onClick={() => props.clearList(btn.type)}>
                            {btn.text}
                        </button>
                    )}
                </div>
            </div>

            <Form />

        </div>
    </header>
)

const mapStateToProps = ({app}) => ({
    blacklist: app.blacklist,
    favorites: app.favorites
})


const mapDispatchToProps = {
    clearList
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)