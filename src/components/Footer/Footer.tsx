import React from 'react';
import { connect } from 'react-redux';
import styles from './Footer.module.scss';
import { showAlert } from '../../redux/actions/app';
import { FooterProps } from './Footer.types';

function Footer(props: FooterProps) {
  const clearLS = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <button
            type="button"
            className={styles.link}
            onClick={clearLS}
          >
            Очистить localStorage
          </button>
          <button
            type="button"
            className={styles.link}
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
