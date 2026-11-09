import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import styles from './Auth.module.scss';
import { closeAuth } from '../../redux/actions/app';
import {
  checkHhToken, getHhToken, removeHhToken, setHhToken,
} from '../../api/hh';
import { AppProps, AuthProps } from './Auth.types';

function Auth({ authError, closeAuth }: AuthProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState(getHhToken());
  const [error, setError] = useState(authError);
  const [isChecking, setChecking] = useState(false);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    setError(authError);
  }, [authError]);

  useEffect(() => {
    const closeByEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuth();
    };

    document.addEventListener('keydown', closeByEsc);

    return () => document.removeEventListener('keydown', closeByEsc);
  }, [closeAuth]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeAuth();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedToken = token.trim();

    if (!trimmedToken) {
      setError('Вставьте токен hh.ru.');
      return;
    }

    setChecking(true);
    setError('');

    const result = await checkHhToken(trimmedToken);

    if (result === 'invalid') {
      setError('hh.ru отклонил этот токен. Проверьте, что он скопирован полностью и не был отозван.');
      setChecking(false);
      return;
    }

    setHhToken(trimmedToken);
    window.location.reload();
  };

  const handleRemove = () => {
    removeHhToken();
    window.location.reload();
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <div
        className={styles.modal}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
      >
        <h2 className={styles.title} id="auth-title">Доступ к API hh.ru</h2>

        <p className={styles.text}>
          hh.ru требует авторизацию для поиска вакансий. Укажите токен приложения
          {' '}
          <code>access_token</code>
          {' '}
          из
          {' '}
          <a
            href="https://dev.hh.ru/admin"
            target="_blank"
            rel="noopener noreferrer"
          >
            личного кабинета dev.hh.ru
          </a>
          .
        </p>

        <form onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="hhToken">
            <span>Токен hh.ru</span>
            <input
              id="hhToken"
              className={styles.input}
              type={isVisible ? 'text' : 'password'}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Вставьте access_token"
              autoComplete="off"
              spellCheck={false}
              disabled={isChecking}
            />
          </label>

          <label className={styles.showToken} htmlFor="showToken">
            <input
              id="showToken"
              type="checkbox"
              checked={isVisible}
              onChange={() => setVisible(!isVisible)}
            />
            Показать токен
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <p className={styles.hint}>
            Токен хранится только в localStorage этого браузера и отправляется напрямую
            в api.hh.ru. Он не попадает в репозиторий и сборку приложения.
          </p>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.primary}
              disabled={isChecking}
            >
              {isChecking ? 'Проверяем токен...' : 'Сохранить и загрузить вакансии'}
            </button>

            {getHhToken() && (
              <button
                type="button"
                className={styles.danger}
                onClick={handleRemove}
                disabled={isChecking}
              >
                Удалить токен
              </button>
            )}

            <button
              type="button"
              className={styles.secondary}
              onClick={closeAuth}
              disabled={isChecking}
            >
              Закрыть
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const mapStateToProps = ({ app: { authError } }: AppProps) => ({
  authError,
});

const mapDispatchToProps = {
  closeAuth,
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
