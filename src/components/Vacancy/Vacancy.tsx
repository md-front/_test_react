import React, { useState } from 'react';
// @ts-ignore
import classNames from 'classnames';
import { connect } from 'react-redux';
import { ReactComponent as Del } from '../../assets/del.svg';
import styles from './Vacancy.module.scss';
import { addToBlacklist } from '../../redux/actions/app';
import { AppState } from '../../types/initialParams.types';
import { VacancyProps, VacancyWrap } from './Vacancy.types';
import { calcCurrency } from './Vacancy.helpers';

function Vacancy({
  vacancy, usdCurrency, addToBlacklist,
}: VacancyProps) {
  const [isHover, setHover] = useState(false);
  const { salary } = vacancy;

  const handleMouseHover = () => setHover(!isHover);

  const validDescription = vacancy.snippet?.length > 100;

  const highlightClass = classNames({
    text: true,
    'text--exp6': vacancy.exp6,
    'text--exp3': vacancy.exp3,
    'text--isJun': vacancy.isJun,
    'text--archived': vacancy.archived,
  });

  const renderSalary = () => {
    const { currency } = salary;
    const formatValue = (value: number) => Math.round(value).toLocaleString();

    const step = (type: string) => {
      const { from = 0, to = 0 } = calcCurrency({ type, salary, usdCurrency });

      const symbol = (() => {
        switch (type) {
          case 'RUR':
            return 'Р';
          case 'USD':
            return '$';
          default:
            return currency;
        }
      })();

      return (
        <span
          key={type}
          className={(usdCurrency && type === currency) ? styles.presetCurrency : ''}
        >
          {!to && from && 'от '}
          {from ? formatValue(from) : 'до'}
          {(from && to) ? ' - ' : ' '}
          {!!to && formatValue(to)}
          &nbsp;
          {symbol}
        </span>
      );
    };

    const salaryRur: React.ReactNode = step(currency);
    let salaryUsd: React.ReactNode;

    if (usdCurrency && currency === 'RUR') {
      salaryUsd = step('USD');
    }

    return [salaryRur, salaryUsd || ''];
  };

  return (
    <a
      href={vacancy.alternateUrl}
      className={styles.link}
      onMouseEnter={handleMouseHover}
      onMouseLeave={handleMouseHover}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={highlightClass}>
        {salary
          && <span className="isSalary">$&nbsp;</span>}
        {vacancy.name}
      </span>
      {vacancy.isNew && <sup className={styles.new}>&nbsp;NEW</sup>}

      {isHover
        && (salary || validDescription)
        && (
          <div className="popup">
            {salary
              && <span className={styles.salary}>{renderSalary()}</span>}
            {validDescription && (
              <span
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: vacancy.snippet }}
              />
            )}
          </div>
        )}

      <button
        type="button"
        className={styles.del}
        onClick={(e) => addToBlacklist(e, vacancy)}
      >
        <Del />
      </button>

    </a>
  );
}

const mapStateToProps = ({ app }: AppState, { vacancy }: VacancyWrap) => ({
  vacancy,
  usdCurrency: app.usdCurrency,
});

const mapDispatchToProps = {
  addToBlacklist,
};

export default connect(mapStateToProps, mapDispatchToProps)(Vacancy);
