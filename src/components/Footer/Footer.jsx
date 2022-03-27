import React from 'react';
import styles from './Footer.module.scss';
import {connect} from "react-redux";
import {showAlert} from "../../redux/actions/app";

const Footer = ({showAlert}) => (
    <footer className={styles.footer}>
        <div className="container">
            <div className={styles.inner}>
                <button type="button"
                        className={styles.link}
                        onClick={showAlert}>Что тут вообще происходит?</button>
            </div>
        </div>
    </footer>
)

const mapDispatchToProps = {
    showAlert
}

export default connect(null, mapDispatchToProps)(Footer)