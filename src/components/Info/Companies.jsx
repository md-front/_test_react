import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/components/Info/Companies.module.scss';
import Company from './Company';

const Companies = ({companies, handleClickAction}) => (
    <div className={styles.items}>
        {companies.map((company, index) =>
            company.vacancies.some(vacancy => !vacancy.is_del) &&
            <Company company={company}
                     key={index}
                     handleClickAction={handleClickAction} />
        )}
    </div>
)

Companies.propTypes = {
    companies: PropTypes.array.isRequired
    // companies: PropTypes.object.isRequired
}

export default Companies