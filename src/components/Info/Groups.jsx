import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/components/Info/Groups.module.scss';
import Companies from './Companies';

const Groups = props => (
    props.groupsEntries.map(([groupName,group],index) =>
        (!group.is_hidden && group.companies && group.companies.length) ?
            <div className={styles[groupName]}
                 key={index}>
                <h3 className={styles.title}>{group.name}</h3>
                <Companies companies={group.companies}/>
            </div>
            :
            ''
    )
)

Groups.propTypes = {
    groupsEntries: PropTypes.array.isRequired
}

export default Groups;