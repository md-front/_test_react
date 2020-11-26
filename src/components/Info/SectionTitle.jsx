import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/components/Info/SectionTitle.module.scss';
import {ReactComponent as Loader} from '../../assets/loader.svg'
import {connect} from "react-redux";
import {changeActiveSection} from "../../redux/actions/regions";

const SectionTitle = ({section, isActiveSection, changeActiveSection, showLoader}) => (
    <div className={isActiveSection ? styles.active : styles.title}
         style={(!isActiveSection && showLoader) ? {pointerEvents: 'none'} : {}}
         onClick={() => (!isActiveSection && !showLoader) ? changeActiveSection(section.id) : ''}>
        <div data-text={section.name}>{section.name}</div>
        <span>
            {isActiveSection && showLoader ?
                <Loader />
                :
                section.visibleVacancies ? section.visibleVacancies : '...'
            }
        </span>
    </div>
)

const mapStateToProps = ({app}, {section, activeTitleId}) => ({
    section,
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