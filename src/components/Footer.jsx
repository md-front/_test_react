import React from 'react';
import styles from '../styles/components/Footer.module.scss';

export default function Footer(props) {

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.inner}>
                    <button type="button"
                            className={styles.link}
                            onClick={props.showAlert}>Что тут вообще происходит?</button>
                </div>
            </div>
        </footer>
    );
}