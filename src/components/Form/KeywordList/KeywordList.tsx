/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { connect } from 'react-redux';
import { deleteKeyword } from '../../../redux/actions/form';
import styles from './KeywordList.module.scss';
import { KeywordListProps } from './KeywordList.types';

function KeywordList({ keywordType, keywordsList, deleteKeyword }: KeywordListProps) {
  return (
    <>
      <h4 key="title">
        {keywordType.itemsTitle}
        :
      </h4>
      {
        keywordsList.map((keyWord) => (
          <span
            className={styles.filterParam}
            onClick={() => deleteKeyword(keywordType.id, keyWord)}
            key={keyWord}
          >
            {keyWord}
          </span>
        ))
      }
    </>
  );
}

const mapDispatchToProps = {
  deleteKeyword,
};

export default connect(null, mapDispatchToProps)(KeywordList);
