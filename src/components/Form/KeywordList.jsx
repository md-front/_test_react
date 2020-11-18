import React from 'react';
import {connect} from "react-redux";
import {deleteKeyword} from '../../redux/actions/form'
import styles from '../../styles/components/Form/KeywordList.module.scss';

const KeywordList = ({keywordType, keywordsList, deleteKeyword}) => [
    <h4 key={'title'}>{keywordType.itemsTitle}:</h4>,
    keywordsList.map((keyWord, index) =>
        <span className={styles.filterParam}
              onClick={() => deleteKeyword(keywordType.id, keyWord)}
              key={index}>{keyWord}</span>
    )
]

const mapDispatchToProps = {
    deleteKeyword
}

export default connect(null, mapDispatchToProps)(KeywordList)
