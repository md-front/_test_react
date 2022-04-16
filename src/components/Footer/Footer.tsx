import React from 'react';
import { connect } from 'react-redux';
import styles from './Footer.module.scss';
import { showAlert } from '../../redux/actions/app';
import { FooterProps } from './Footer.types';

function Footer(props: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <button
            type="button"
            className={styles.link}
            // @ts-ignore TODO
            onClick={props.showAlert}
          >
            Что тут вообще происходит?
          </button>
        </div>
      </div>
    </footer>
  );
}

const mapDispatchToProps = {
  showAlert,
};

export default connect(null, mapDispatchToProps)(Footer);
