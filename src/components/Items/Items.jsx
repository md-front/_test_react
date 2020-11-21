import React from 'react';
import {isObjectsEqual} from '../../helpers';
import styles from '../../styles/components/Items/Items.module.scss';
import ItemsSection from './ItemsSection';
import ItemsTitle from "./ItemsTitle";
import {connect} from "react-redux";

const Items = props => (
    <main>
        <div className="container">
            <div className={styles.nav}>
                {props.regions.map((section, index) =>
                    section.checked &&
                    <ItemsTitle section={section}
                                key={index} />
                )}
            </div>
        </div>
        {props.regions.map((section, index) =>
            section.is_active &&
            <ItemsSection section={section}
                          key={index} />
        )}
    </main>
)

const mapStateToProps = ({regions}) => ({
    regions,
})

export default connect(mapStateToProps)(Items)