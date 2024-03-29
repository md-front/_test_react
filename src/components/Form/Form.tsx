import Select from 'rc-select';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { ReactComponent as Info } from '../../assets/info.svg';
import { ReactComponent as More } from '../../assets/search-more.svg';
import { ReactComponent as Share } from '../../assets/share.svg';
import { cloneObj } from '../../helpers';
import {
  changeNewInDays as ChangeNewInDays,
  clearKeywords as ClearKeywords,
  formSubmit as FormSubmit,
} from '../../redux/actions/form';
import '../../styles/vendor/select.scss';
import { Region, UrlOption } from '../../types/initialParams.types';
import { REQUIRED_FIELD_TOOLTIP, KEYWORD_FIELDS_DATA } from './Form.constants';
import styles from './Form.module.scss';
import {
  FormGetState, FormProps,
} from './Form.types';
import { KeywordFields } from './KeywordFields';
import { KeywordList } from './KeywordList';
import { Salary } from './Salary';

function Form(props: FormProps) {
  const {
    necessary,
    unnecessary,
    newInDays,
    changeNewInDays,
    clearKeywords,
    formSubmit,
  } = props;

  const [name, setName] = useState(props.name);
  const [regions, setRegions] = useState(cloneObj(props.regions));
  const [experience, setExperience] = useState(props.experience);
  const [showMore, setShowMore] = useState(true);

  const toggle = () => {
    setShowMore(!showMore);
  };

  const defaultValidation = () => name.trim() && regions.some((region: Region) => region.checked)
  && experience.some((region) => region.checked);

  const handleClickExp = (id: string) => {
    const params = experience.map((param) => {
      if (param.id === id) {
        param.checked = !param.checked;
      }

      return param;
    });

    setExperience(params);
  };

  const handleClickReg = (id: string) => {
    const params = [...regions].map((param) => {
      if (param.id === id) {
        param.checked = !param.checked;
      }

      return param;
    });

    setRegions(params);
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    formSubmit({
      name,
      experience,
      formRegions: regions,
    });
  };

  const share = () => {
    const transformToUrlFormat = (arr: Array<UrlOption>) => {
      return arr.reduce((sum, item) => (item.checked ? sum += `${item.id},` : sum), '').slice(0, -1);
    };

    const _name = name.trim().split(' ').join('+');
    const _regions = transformToUrlFormat(regions);
    const _experience = transformToUrlFormat(experience);

    const _necessary = necessary.length ? necessary.join(',') : null;
    const _unnecessary = unnecessary.length ? unnecessary.join(',') : null;

    // eslint-disable-next-line max-len
    const _url = `${window.location.origin}${window.location.pathname}?name=${_name}&regions=${_regions}&experience=${_experience}${_necessary ? `&necessary=${_necessary}` : ''}${_unnecessary ? `&unnecessary=${_unnecessary}` : ''}`;

    window.navigator.clipboard.writeText(_url);
  };

  return (
    <form
      className={styles.form}
      onSubmit={submit}
    >

      <div className={styles.inner}>

        <label className={styles.itemName} htmlFor="Вакансия">
          <span className={styles.label}>
            Вакансия
            <Info
              data-tip={REQUIRED_FIELD_TOOLTIP}
              className={name ? styles.warningDisabled : styles.warning}
              data-type="error"
              data-effect="solid"
            />

            <ReactTooltip />
          </span>

          <input
            className={styles.input}
            type="text"
            placeholder="Frontend"
            id="name"
            value={name}
            onChange={handleChange}
          />
        </label>

        <div className={styles.item}>
          <div className={styles.label}>
            Регионы поиска

            <Info
              data-tip={REQUIRED_FIELD_TOOLTIP}
              className={regions.some((checkbox: Region) => checkbox.checked) ? styles.warningDisabled : styles.warning}
              data-type="error"
              data-effect="solid"
            />

            <ReactTooltip type="error" />
          </div>

          <div className={styles.checkboxWrap}>
            {regions.map((region: Region) => (
              <label
                key={region.id}
                htmlFor={region.id}
                className={styles.checkbox}
              >
                <input
                  type="checkbox"
                  checked={region.checked}
                  onChange={() => handleClickReg(region.id)}
                  id={region.id}
                />
                <span />
                <span>{region.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.item}>
          <span className={styles.label}>
            Опыт

            <Info
              data-tip={REQUIRED_FIELD_TOOLTIP}
              className={experience.some((checkbox) => checkbox.checked) ? styles.warningDisabled : styles.warning}
              data-type="error"
              data-effect="solid"
            />

            <ReactTooltip />
          </span>

          <div className={styles.checkboxWrap}>
            {experience.map((experience) => (
              <label
                key={experience.id}
                htmlFor={experience.id}
                className={styles.checkbox}
              >
                <input
                  type="checkbox"
                  checked={experience.checked}
                  onChange={() => handleClickExp(experience.id)}
                  id={experience.id}
                />
                <span />
                <span>{experience.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.btns}>
          <button
            className={styles.btn}
            disabled={!defaultValidation()}
            type="submit"
          >
            Поиск
          </button>

          <button
            type="button"
            className={styles.toggle}
            onClick={toggle}
          >
            <More />
          </button>
        </div>
      </div>

      <div className={showMore ? styles.innerBottom : styles.hidden}>

        {KEYWORD_FIELDS_DATA.map((keyword) => (
          <KeywordFields
            keyword={keyword}
            key={keyword.label}
          />
        ))}

        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label
          className={styles.item}
        >
          <span className={styles.label}>Учитывать &quot;новые&quot; за</span>

          <Select
            id="newInDays"
            prefixCls="select"
            // @ts-ignore
            defaultValue={newInDays.find((option) => option.checked).value}
            options={newInDays}
            onChange={changeNewInDays}
            menuItemSelectedIcon=""
            showSearch={false}
          />
        </label>

        <div className={styles.btns}>
          <Salary />

          <button
            type="button"
            className={styles.btnCopy}
            disabled={!defaultValidation()}
            onClick={share}
            data-tip="Скопировано!"
            data-effect="solid"
            data-delay-hide="2000"
            data-iscapture
            data-event="click"
          >
            <Share />
          </button>
          <ReactTooltip globalEventOff="click" />
        </div>
      </div>

      <div className={styles.filters}>
        {KEYWORD_FIELDS_DATA.map((keywordType) => (props[keywordType.id].length
          ? (
            <KeywordList
              keywordType={keywordType}
              keywordsList={props[keywordType.id]}
              key={keywordType.id}
            />
          )
          : ''))}

        {(necessary.length || unnecessary.length)
          ? (
            <button
              type="button"
              className={styles.clear}
              onClick={clearKeywords}
            >
              Очистить все
            </button>
          )
          : ''}
      </div>
    </form>
  );
}

const mapStateToProps = ({ form, regions }: FormGetState) => ({
  name: form.name,
  necessary: form.necessary,
  unnecessary: form.unnecessary,
  newInDays: form.newInDays,
  experience: cloneObj(form.experience),
  regions,
});

const mapDispatchToProps = {
  changeNewInDays: ChangeNewInDays,
  clearKeywords: ClearKeywords,
  formSubmit: FormSubmit,
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);
