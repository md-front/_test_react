import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { ReactComponent as Info } from '../../../assets/info.svg';
import useDebounce from '../../../hooks/useDebounce';
import { changeMinSalary } from '../../../redux/actions/app';
import { AppState } from '../../../types/initialParams.types';
import styles from '../Form.module.scss';

function Salary() {
  const isSalaryOnly = useSelector(({ app }: AppState) => app.isSalaryOnly);
  const minSalary = useSelector(({ app }: AppState) => app.minSalary);
  const [searchTerm, setSearchTerm] = useState(minSalary);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const dispatch = useDispatch();

  const tip = `Вакансии с${!isSalaryOnly ? ' указаной' : ''} ЗП (в рублях) ниже значения будут скрыты`;

  const onChange = (e: any) => {
    setSearchTerm(e.target.value.replace(/\D/g, ''));
  };

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        dispatch(changeMinSalary(debouncedSearchTerm));
      } else {
        dispatch(changeMinSalary(''));
      }
    },
    [dispatch, debouncedSearchTerm],
  );

  return (
    <label htmlFor="minSalary" className={styles.minSalary}>
      <span className={styles.label}>
        Зарплата от
        <Info
          data-tip={tip}
          data-effect="solid"
        />
        <ReactTooltip />
      </span>

      <input
        className={styles.input}
        type="text"
        id="minSalary"
        placeholder="50000"
        value={searchTerm}
        onChange={onChange}
      />
    </label>
  );
}

export default Salary;
