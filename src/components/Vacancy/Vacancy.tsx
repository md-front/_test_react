import React, { useState } from 'react';
// @ts-ignore
import classNames from 'classnames';
import { connect } from 'react-redux';
import { ReactComponent as Del } from '../../assets/del.svg';
import styles from './Vacancy.module.scss';
import { addToBlacklist } from '../../redux/actions/app';
import { AppState } from '../../types/initialParams.types';
import { VacancyWrap } from './Vacancy.types';
import { calcCurrency } from './Vacancy.helpers';

function Vacancy({ vacancy, usdCurrency }: any) {
  const [isHover, setHover] = useState(false);

  const handleMouseHover = () => setHover(!isHover);

  const { salary } = vacancy;
  const validDescription = vacancy.snippet && vacancy.snippet.requirement && vacancy.snippet.requirement.length > 100;

  const highlightClass = classNames({
    text: true,
    'text--exp6': vacancy.exp6,
    'text--exp3': vacancy.exp3,
    'text--isJun': vacancy.isJun,
  });

  const renderSalary = () => {
    const step = (type: string) => {
      const { from = 0, to = 0 } = calcCurrency({ type, salary, usdCurrency });

      const formatValue = (value: number) => Math.round(value).toLocaleString();

      return (
        <span
          key={type}
          className={(usdCurrency && type === salary.currency) ? styles.presetCurrency : ''}
        >
          {from ? formatValue(from) : ''}
          {(from && to) ? ' - ' : ''}
          {to ? formatValue(to) : ''}
          &nbsp;
          {type === 'RUR' ? 'Р' : '$'}
        </span>
      );
    };

    const salaryRur: React.ReactNode = step('RUR');
    let salaryUsd: React.ReactNode;

    if (usdCurrency) {
      salaryUsd = step('USD');
    }

    return [salaryRur, salaryUsd || ''];
  };

  return (
    <a
      href={vacancy.alternate_url}
      className={styles.link}
      onMouseEnter={handleMouseHover}
      onMouseLeave={handleMouseHover}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={highlightClass}>
        {salary && <span className="isSalary">$&nbsp;</span>}
        {vacancy.name}
      </span>
      {vacancy.isNew && <sup className={styles.new}>&nbsp;NEW</sup>}

      {isHover && (salary || validDescription)
        && (
          <div className="popup">
            {salary && <span className={styles.salary}>{renderSalary()}</span>}
            {validDescription && (
              <span
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: vacancy.snippet.requirement }}
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
