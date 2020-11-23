import React, {useEffect} from 'react';
import styles from '../../styles/components/Items/ItemsTitle.module.scss';
import {ReactComponent as Loader} from '../../assets/loader.svg'
import {changeActiveSection} from "../../redux/actions/regions";
import {connect} from "react-redux";
import {showLoader} from "../../redux/actions/app";

const ItemsTitle = ({section, changeActiveSection, showLoader}) => (
    <div className={section.is_active ? styles.active : styles.title}
         onClick={() => !section.is_active ? changeActiveSection(section.id) : ''}>
        <div data-text={section.name}>{section.name}</div>
        {section.checked &&
            <span>
                {section.is_active && showLoader ?
                    <Loader />
                    :
                    (section.visibleVacancies ?
                            section.visibleVacancies
                            :
                            '...'
                    )
                }
            </span>
        }
    </div>
)

const mapStateToProps = ({app}, {section}) => ({
    section,
    showLoader: app.showLoader
})

const mapDispatchToProps = {
    changeActiveSection
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsTitle)