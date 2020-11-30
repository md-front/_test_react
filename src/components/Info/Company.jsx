import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/components/Info/Company.module.scss';
import Vacancy from './Vacancy';
import {connect} from "react-redux";
import {toggleFavorite} from "../../redux/actions/app";

const Company = ({company, toggleFavorite}) => {

    const logoUrl = company.vacancies[0].employer.logo_urls;

    return (
        <div className={styles.item}>
            <div className={styles.title}
                 onClick={() => toggleFavorite(company.id)}
                 title="В избранное">
                <h2>{company.name}</h2>

               {logoUrl && <img src={logoUrl['90']} alt="logo"/>}
            </div>

            {company.vacancies.map((vacancy, index) =>
                !vacancy.is_del &&
                <Vacancy vacancy={vacancy}
                         key={index} />
            )}

        </div>
    );
}

const mapStateToProps = ({}, {company}) => ({
    company,
})

const mapDispatchToProps = {
    toggleFavorite
}

Company.propTypes = {
    company: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Company)