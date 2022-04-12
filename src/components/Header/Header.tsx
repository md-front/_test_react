import React from 'react';
import { connect } from 'react-redux';
import { Form } from '../Form';
import styles from './Header.module.scss';
import { clearList } from '../../redux/actions/app';
import { AppProps, HeaderProps } from './Header.types';
import { BUTTONS_DATA } from './Header.constants';

function Header(props: HeaderProps) {
  return (
    <header>
      <div className="container">

        <div className={styles.actions}>
          <a
            href={window.location.origin + window.location.pathname}
            className={styles.rootLink}
            title="Применить стандартный поиск"
          >
            <h1 className={styles.title}>Поиск вакансий</h1>
          </a>

          <div className={styles.btns}>
            {BUTTONS_DATA.map((btn) => (
              <button
                type="button"
                key={btn.type}
                className={
                  props[btn.type].length ? styles[btn.className] : styles[btn.disableClassName]
                }
                onClick={() => props.clearList(btn.type)}
              >
                {btn.text}
              </button>
            ))}
          </div>
        </div>

        {/* @ts-ignore TODO */}
        <Form />

      </div>
    </header>
  );
}

const mapStateToProps = ({
  app: {
    blacklist,
    favorites,
  },
}: AppProps) => ({
  blacklist,
  favorites,
});

const mapDispatchToProps = {
  clearList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
