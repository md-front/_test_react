import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/components/Info/SectionTitle.module.scss';
import {ReactComponent as Loader} from '../../assets/loader.svg'
import {connect} from "react-redux";
import {changeNewInDays, clearKeywords, formSubmit} from "../../redux/actions/form";
import {changeActiveSection, changeSelectedRegions} from "../../redux/actions/regions";

const SectionTitle = ({section, isActiveSection, changeActiveSection, showLoader}) => (
    <div className={isActiveSection ? styles.active : styles.title}
         onClick={() => !isActiveSection ? changeActiveSection(section.id) : ''}>
        <div data-text={section.name}>{section.name}</div>
        {section.checked &&
            <span>
                {isActiveSection && showLoader ?
                    <Loader />
                    :
                    section.visibleVacancies ? section.visibleVacancies : '...'
                }
            </span>
        }
    </div>
)

const mapStateToProps = ({app}, {section, activeTitleId, changeActiveTitle}) => ({
    section,
    // changeActiveTitle,
    isActiveSection: section.id === activeTitleId,
    showLoader: app.showLoader
})

const mapDispatchToProps = {
    changeActiveSection
}

SectionTitle.propTypes = {
    section: PropTypes.object.isRequired,
    activeTitleId: PropTypes.string.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionTitle)