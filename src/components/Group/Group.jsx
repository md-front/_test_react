import React from 'react';
import PropTypes from 'prop-types';
import styles from './Group.module.scss';
import Company from '../Company/Company';

const Group = ({companies, handleClickAction}) => (
    <div className={styles.items}>
        {companies.map((company, index) =>
            company.vacancies.some(vacancy => !vacancy.is_del) &&
            <Company company={company}
                     key={index}
                     handleClickAction={handleClickAction} />
        )}
    </div>
)

Group.propTypes = {
    companies: PropTypes.array.isRequired
}

export default Group