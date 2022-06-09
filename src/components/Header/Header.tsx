import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Form } from '../Form';
import styles from './Header.module.scss';
import {
  clearList, toggleVisibilityArchived, removeArchived, toggleSalaryOnly,
} from '../../redux/actions/app';
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
            <label htmlFor="isSalaryOnly" className={styles.showArchived}>
              <input
                type="checkbox"
                id="isSalaryOnly"
                checked={props.isSalaryOnly}
                onChange={() => props.toggleSalaryOnly()}
              />
              <span><span /></span>
              <span>Только с ЗП</span>
            </label>

            {props.haveArchived && (
              <label htmlFor="showArchived" className={styles.showArchived}>
                <input
                  type="checkbox"
                  id="showArchived"
                  checked={props.showArchived}
                  onChange={() => props.toggleVisibilityArchived(!props.showArchived)}
                />
                <span><span /></span>
                <span>Архивные вакансии</span>
              </label>
            )}
            <button
              type="button"
              className={props.haveArchived
                ? styles.arch : styles['arch-disabled']}
              onClick={() => props.removeArchived()}
              data-tip="Старые данные удалены"
              data-effect="solid"
              data-delay-hide="2000"
              data-iscapture
              data-event="click"
            >
              Очистить архив
            </button>
            <ReactTooltip globalEventOff="click" />
            {BUTTONS_DATA.map((btn) => (
              <button
                type="button"
                key={btn.type}
                // @ts-ignore
                className={props[btn.type].length ? styles[btn.className] : styles[btn.disableClassName]}
                onClick={() => props.clearList(btn.type)}
              >
                {btn.text}
              </button>
            ))}
          </div>
        </div>

        <Form />

      </div>
    </header>
  );
}

const mapStateToProps = ({
  app: {
    blacklist,
    favorites,
    showArchived,
    isSalaryOnly,
    haveArchived,
  },
}: AppProps) => ({
  haveArchived,
  blacklist,
  favorites,
  showArchived,
  isSalaryOnly,
});

const mapDispatchToProps = {
  clearList,
  removeArchived,
  toggleVisibilityArchived,
  toggleSalaryOnly,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
