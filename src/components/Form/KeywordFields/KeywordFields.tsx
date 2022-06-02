import React, { useState, useEffect, useMemo } from 'react';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { ReactComponent as Info } from '../../../assets/info.svg';
import { addKeyword as AddKeyword, deleteKeyword as DeleteKeyword } from '../../../redux/actions/form';
import styles from '../Form.module.scss';
import { KeywordFieldProps } from './KeywordFields.types';
import { KEYWORDS } from '../Form.constants';
import { Keywords } from '../../../types/initialParams.types';
import { checkKeywordInList } from './KeywordFields.helpers';

function KeywordFields(props: KeywordFieldProps) {
  const {
    keyword, AddKeyword, DeleteKeyword,
  } = props;
  const [input, setInput] = useState('');
  const [tooltip, setTooltip] = useState({
    type: '',
    text: '',
  });

  const availableButton: boolean = useMemo(() => input.trim() !== '', [input]);

  // @ts-ignore
  let tooltipRef: Element = React.useRef(null);

  const clearInput = () => setInput('');

  useEffect(() => {
    if (tooltip.text) {
      ReactTooltip.show(tooltipRef);

      setTimeout(() => {
        ReactTooltip.hide(tooltipRef);
        setTooltip({
          type: '',
          text: '',
        });
      }, 2000);
    }
  }, [tooltip]);

  const addKeyword = () => {
    const type = keyword.id;
    const inputValue = input.trim();

    const keywords = props[type];
    const diffType = KEYWORDS.find((diffType) => diffType !== type);

    const removeFromDifferentKeywords = () => {
      if (!checkKeywordInList(props[diffType!], inputValue)) return;

      // @ts-ignore TODO
      DeleteKeyword(diffType, inputValue);

      setTooltip({
        type: 'dark',
        text: `"${inputValue}" перенесено из ${diffType === 'necessary' ? 'ключевых слов' : 'исключающих слов'}`,
      });
    };

    if (!checkKeywordInList(keywords, inputValue)) {
      AddKeyword(type, inputValue);

      removeFromDifferentKeywords();
    } else {
      setTooltip({
        type: 'error',
        text: `"${inputValue}" уже присутствует в фильтре`,
      });
    }

    clearInput();
  };

  return (
    <label className={styles.keyword} htmlFor={`${keyword.id}Input`}>
      <span className={styles.label}>
        {keyword.label}
        <Info
          data-tip={keyword.baseTooltip}
          data-effect="solid"
        />
        <ReactTooltip />
      </span>

      <input
        className={styles.input}
        type="text"
        id={`${keyword.id}Input`}
        placeholder={keyword.placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        type="button"
        className={styles.btnKeyword}
        disabled={!availableButton}
        onClick={addKeyword}
        data-tip={tooltip.text}
        data-type={tooltip.type}
        data-effect="solid"
        data-iscapture
        // @ts-ignore
        ref={(ref) => { tooltipRef = ref; }}
        data-event="custom"
      >
        +
      </button>
      <ReactTooltip />
    </label>
  );
}

interface AppState {
  form: Keywords
}

const mapStateToProps = (state: AppState) => ({
  necessary: state.form.necessary,
  unnecessary: state.form.unnecessary,
});

const mapDispatchToProps = {
  AddKeyword,
  DeleteKeyword,
};

export default connect(mapStateToProps, mapDispatchToProps)(KeywordFields);
