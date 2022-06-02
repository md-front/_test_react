import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Form } from '../Form';
import styles from './Header.module.scss';
import { clearList, toggleArchived } from '../../redux/actions/app';
import { AppProps, HeaderProps } from './Header.types';
import { BUTTONS_DATA } from './Header.constants';

function Header(props: HeaderProps) {
  const isImprintFavExist = props.imprintFav.some((region) => region.vacancies.length);

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
            {isImprintFavExist && (
              <label htmlFor="showArchived" className={styles.showArchived}>
                <input
                  type="checkbox"
                  id="showArchived"
                  checked={props.showArchived}
                  onChange={() => props.toggleArchived(!props.showArchived)}
                />
                <span><span /></span>
                <span>Показывать архивные вакансии</span>
              </label>
            )}
            <button
              type="button"
              className={isImprintFavExist
                ? styles.arch : styles['arch-disabled']}
              onClick={() => props.clearList('imprintFav')}
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
                // @ts-ignore TODO
                className={props[btn.type].length ? styles[btn.className] : styles[btn.disableClassName]}
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
    imprintFav,
    blacklist,
    favorites,
    showArchived,
  },
}: AppProps) => ({
  imprintFav,
  blacklist,
  favorites,
  showArchived,
});

const mapDispatchToProps = {
  clearList,
  toggleArchived,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
