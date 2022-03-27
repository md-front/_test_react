import React from 'react';
import Form from '../Form/Form';
import styles from './Header.module.scss';
import {connect} from "react-redux";
import {clearList} from "../../redux/actions/app";
import {HeaderState, HeaderProps} from "./Header.types";
import {BUTTONS_DATA} from "./Header.constants";

const Header = (props: HeaderProps) => <header>
    <div className="container">

        <div className={styles.actions}>
            <a href={window.location.origin + window.location.pathname}
               className={styles.rootLink}
               title="Применить стандартный поиск">
                <h1 className={styles.title}>Поиск вакансий</h1>
            </a>

            <div className={styles.btns}>
                {BUTTONS_DATA.map((btn, index) =>
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

const mapStateToProps = ({app: {
    blacklist,
    favorites
}}: HeaderState) => ({
    blacklist,
    favorites
})


const mapDispatchToProps = {
    clearList
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)