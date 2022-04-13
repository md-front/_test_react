import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { ReactComponent as Info } from '../../../assets/info.svg';
import { addKeyword as AddKeyword, deleteKeyword as DeleteKeyword } from '../../../redux/actions/form';
import styles from '../Form.module.scss';
import { KeywordFieldProps, KeywordField } from './KeywordFields.types';
import { KEYWORDS } from '../Form.constants';
import { Keywords } from '../../../types/initialParams.types';

function KeywordFields(props: KeywordFieldProps) {
  const {
    keyword, AddKeyword, DeleteKeyword,
  } = props;
  const [input, setInput] = useState('');
  const [tooltip, setTooltip] = useState({
    type: '',
    text: '',
  });

  let tooltipRef = React.useRef(null);

  const clearInput = () => setInput('');

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  useEffect(() => {
    clearInput();

    if (tooltip.text) {
      // @ts-ignore
      ReactTooltip.show(tooltipRef);

      setTimeout(() => {
        // @ts-ignore
        ReactTooltip.hide(tooltipRef);
        setTooltip({
          type: '',
          text: '',
        });
      }, 2000);
    }
  }, [tooltip]);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };

  const addKeyword = () => {
    const name = keyword.id;
    const inputValue = input.trim();
    const keywords = props[name];
    // const diffName = ['necessary', 'unnecessary'].find((difName) => difName !== name);
    const diffName = KEYWORDS.find((difName) => difName !== name);
    // @ts-ignore TODO
    let differentKeywords = props[diffName];

    const removeFromDifferentKeywords = () => {
      if (!differentKeywords.includes(inputValue)) return;
      // @ts-ignore TODO
      // eslint-disable-next-line max-len
      differentKeywords = differentKeywords.filter((keyword: KeywordField) => keyword.toLowerCase() !== inputValue.toLowerCase());

      // @ts-ignore TODO
      DeleteKeyword(diffName, inputValue);

      setTooltip({
        type: 'dark',
        text: `"${inputValue}" перенесено из ${diffName === 'necessary' ? 'ключевых слов' : 'исключающих слов'}`,
      });
    };

    if (!keywords.some((keyword) => keyword.toLowerCase() === inputValue.toLowerCase())) {
      AddKeyword(name, inputValue);

      removeFromDifferentKeywords();
      clearInput();
    } else {
      setTooltip({
        type: 'error',
        text: `"${inputValue}" уже присутствует в фильтре`,
      });
    }
  };

  const keydownHandler = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      addKeyword();
    }
  };

  const listenSubmit = () => {
    document.addEventListener('keydown', keydownHandler);
  };

  const removeListenSubmit = () => {
    document.removeEventListener('keydown', keydownHandler);
  };

  return (
    <label className={styles.keyword} htmlFor={`${keyword.id}Input`}>
      <span className={styles.label}>
        {keyword.label}
        {' '}
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
        onFocus={listenSubmit}
        onBlur={removeListenSubmit}
        onChange={handleChange}
      />

      <button
        type="button"
        className={styles.btnKeyword}
        disabled={!input.trim()}
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
