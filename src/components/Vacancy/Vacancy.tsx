import React, { useState } from 'react';
// @ts-ignore
import classNames from 'classnames';
import { connect } from 'react-redux';
import { ReactComponent as Del } from '../../assets/del.svg';
import styles from './Vacancy.module.scss';
import { addToBlacklist } from '../../redux/actions/app';
import { VacancyProps, VacancyWrap } from './Vacancy.types';

function Vacancy({
  vacancy, addToBlacklist,
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

  const isNewBadge = vacancy.isNew && <sup className={styles.new}>&nbsp;NEW</sup>;

  const salaryBadge = salary && <span className="isSalary">$&nbsp;</span>;

  const salaryValue = salary?.component
    && (
      <span className={styles.salary}>
        {salary.component.map((salaryValue, i) => (
          <span className={i === 0 ? styles.presetCurrency : ''} key={salaryValue}>{salaryValue}</span>
        ))}
      </span>
    );

  const description = validDescription && (
    <span
      className={styles.description}
      dangerouslySetInnerHTML={{ __html: vacancy.snippet }}
    />
  );

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
        {salaryBadge}
        {vacancy.name}
      </span>
      {isNewBadge}

      {isHover && (salary || validDescription)
        && (
          <div className="popup">
            {salaryValue}
            {description}
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

// eslint-disable-next-line no-empty-pattern
const mapStateToProps = ({ }, { vacancy }: VacancyWrap) => ({
  vacancy,
});

const mapDispatchToProps = {
  addToBlacklist,
};

export default connect(mapStateToProps, mapDispatchToProps)(Vacancy);
