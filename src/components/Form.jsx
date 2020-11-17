import React from 'react';
import Select from 'rc-select';
import ReactTooltip from 'react-tooltip/dist/index';
import {cloneObj} from '../helpers';
import {ReactComponent as Info} from '../assets/info.svg'
import {ReactComponent as Share} from '../assets/share.svg'
import {ReactComponent as More} from '../assets/search-more.svg'
import styles from '../styles/components/Form.module.scss';
import '../styles/vendor/select.scss';

export default class Form extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showMore: true,
            necessaryInput: '',
            unnecessaryInput: '',
            url: '',
            keyWordTooltip: {
                type: '',
                text: ''
            },
            ...this.props.searchParams
        };

        // this.defaultParams = this.props.searchParams;

        this.share = this.share.bind(this);
        this.toggle = this.toggle.bind(this);
        this.submit = this.submit.bind(this);
        this.addKeyword = this.addKeyword.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.clearKeywords= this.clearKeywords.bind(this);
        this.defaultValidation= this.defaultValidation.bind(this);
        // this.setDefaultParams = this.setDefaultParams.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
    }

    defaultValidation() {
        return this.state.name && this.state.regions.some(region => region.checked) && this.state.experience.some(region => region.checked)
    }

    clearKeywords() {
        this.setState({
            necessary: [],
            unnecessary: [],
        })
    }

    toggle() {
        this.setState({showMore: !this.state.showMore});
    }

    handleChange(e) {
        this.setState({[e.target.id]: e.target.value});
    }

    handleChangeSelect(value) {
        this.setState({newInDays: value});
    }

    addKeyword(name) {
        const inputName = `${name}Input`
        const inputValue = this.state[inputName];
        const keywords = this.state[name];
        const diffName = ['necessary','unnecessary'].find(difName => difName !== name);
        let differentKeywords = this.state[diffName];
        let keyWordTooltip = {};

        if(!keywords.includes(inputValue)) {
            keywords.push(inputValue)
            removeFromDifferentKeywords();
        } else {
            keyWordTooltip = {
                type: 'error',
                text: `"${inputValue}" уже присутствует в фильтре`
            }
        }

        this.setState({
            [name]: keywords,
            [diffName]: differentKeywords,
            [inputName]: '',
            keyWordTooltip
        }, showTooltip)


        function removeFromDifferentKeywords() {
            if(!differentKeywords.includes(inputValue)) return;
            differentKeywords = differentKeywords.filter(keyword => keyword !== inputValue);

            keyWordTooltip = {
                type: 'dark',
                text: `"${inputValue}" перенесено из ${diffName === 'necessary' ? 'ключевых слов' : 'исключающих слов'}`
            }
        }
        function showTooltip() {
            if(!this.state.keyWordTooltip.text) return;

            ReactTooltip.show(this[`${name}Tooltip`]);
            setTimeout(()=>{
                ReactTooltip.hide(this[`${name}Tooltip`]);
                this.setState({
                    keyWordTooltip: {
                        type: '',
                        text: ''
                    }
                })
            },2000);
        }
    }

    removeKeyword(id, value) {
        let keywords = [...this.state[id]];
        keywords = keywords.filter(keyword => keyword !== value);

        this.setState({[id]: keywords})
    }

    handleClick(e, paramName) {
        const params = cloneObj(this.state[paramName]);
        const param = params.find(param => param.id === e.target.id);
        param.checked = !param.checked;

        /* TODO ? */
        if(param.is_active)
            param.is_active = false;

        this.setState({[paramName]: params})
    }

    submit(e) {
        e.preventDefault();

        this.props.search({
            name: this.state.name,
            regions: this.state.regions,
            experience: this.state.experience,
            necessary: this.state.necessary,
            unnecessary: this.state.unnecessary,
            newInDays: this.state.newInDays,
        })
    }

    /*setDefaultParams() {
        this.setState({...this.defaultParams})
    }*/

    share() {
        const name = this.state.name;
        const necessary = this.state.necessary.length ? this.state.necessary.join(',') : null;
        const unnecessary = this.state.unnecessary.length ? this.state.unnecessary.join(',') : null;
        const newInDays = this.state.newInDays;
        const regions = transformToUrlFormat(this.state.regions);
        const experience = transformToUrlFormat(this.state.experience);

        const url = `${window.location.origin}${window.location.pathname}?name=${name}&regions=${regions}&experience=${experience}&newInDays=${newInDays}${necessary ? '&necessary='+necessary : ''}${unnecessary ? '&unnecessary='+unnecessary : ''}`

        window.navigator.clipboard.writeText(url);

        function transformToUrlFormat(arr) {
            return arr.reduce((sum, item) => item.checked ? sum += `${item.id},` : sum,'').slice(0, -1)
        }
    }

    render() {
        const keyWordFields = [
            {
                label: 'Добавить ключевое слово',
                id: 'necessary',
                placeholder: 'По персоналу',
                tooltip: 'Отображаемые акансии будут содержать хотя-бы одно ключевое слово',
                value: this.state.necessaryInput,
            },
            {
                label: 'Добавить исключающее ключевое слово',
                id: 'unnecessary',
                placeholder: 'По продажам',
                tooltip: 'Названия вакансий с данным словом будут скрыты',
                value: this.state.unnecessaryInput,
            }
        ]
        const newInDaysOptions = [
            {
                value: 1,
                label: '1 день'
            },
            {
                value: 2,
                label: '2 дня'
            },
            {
                value: 3,
                label: '3 дня'
            },
            {
                value: 7,
                label: '1 неделю'
            },
            {
                value: 14,
                label: '2 недели'
            },
        ]

        return (
            <form className={styles.form}
                  onSubmit={this.submit}>

                <div className={styles.inner}>
                    <label className={styles.item}>
                        <span className={styles.label}>Вакансия <sup>*</sup></span>

                        <input className={styles.input}
                               type="text"
                               placeholder="Менеджер"
                               id="name"
                               value={this.state.name}
                               onChange={this.handleChange}/>
                    </label>

                    <div className={styles.item}>
                        <div className={styles.label}>Регионы поиска <sup>*</sup></div>

                        <div className={styles.checkboxWrap}>
                            {this.state.regions.map((region, index) =>
                                <label key={index}
                                       className={styles.checkbox}>
                                    <input type="checkbox"
                                           checked={region.checked}
                                           onChange={e =>this.handleClick(e, 'regions')}
                                           id={region.id}/>
                                    <span/>
                                    <span>{region.name}</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className={styles.item}>
                        <span className={styles.label}>Опыт <sup>*</sup></span>

                        <div className={styles.checkboxWrap}>
                            {this.state.experience.map((experience, index) =>
                                <label key={index}
                                       className={styles.checkbox}>
                                    <input type="checkbox"
                                           checked={experience.checked}
                                           onChange={e => this.handleClick(e, 'experience')}
                                           id={experience.id}/>
                                    <span/>
                                    <span>{experience.name}</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className={styles.btns}>
                        {/* TODO this.state.regions.some оптимизировать */}
                        <button className={styles.btn}
                                disabled={!this.defaultValidation()}
                                type="submit">Поиск</button>

                        <button type="button"
                                className={styles.toggle}
                                onClick={this.toggle}>
                            <More/>
                        </button>
                    </div>
                </div>

                <div className={this.state.showMore ? styles.innerBottom : styles.hidden}>

                    {keyWordFields.map((keyWord, index) =>
                        <label className={styles.keyword}
                               key={index}>

                            <span className={styles.label}>
                                {keyWord.label} <Info data-tip={keyWord.tooltip}
                                                      data-effect="solid"/>
                                <ReactTooltip />
                            </span>

                            <input className={styles.input}
                                   type="text"
                                   id={keyWord.id+'Input'}
                                   placeholder={keyWord.placeholder}
                                   value={keyWord.value}
                                   onChange={this.handleChange}/>

                            <button type="button"
                                    className={styles.btnKeyword}
                                    disabled={!keyWord.value}
                                    onClick={() => this.addKeyword(keyWord.id)}
                                    data-tip={this.state.keyWordTooltip.text}
                                    data-type={this.state.keyWordTooltip.type}
                                    data-effect="solid"
                                    data-iscapture={true}
                                    ref={ref => {this[`${keyWord.id}Tooltip`] = ref}}
                                    data-event='custom'>+</button>
                            <ReactTooltip />
                        </label>
                    )}

                    <label className={styles.item}>
                        <span className={styles.label}>Учитывать "новые" за</span>

                        <Select id="newInDays"
                                prefixCls="select"
                                defaultValue={+this.state.newInDays}
                                options={newInDaysOptions}
                                onChange={this.handleChangeSelect}
                                menuItemSelectedIcon=""
                                showSearch={false} />
                    </label>


                    <div className={styles.btns}>
                        <button type="button"
                                className={styles.btnCopy}
                                disabled={!this.defaultValidation()}
                                onClick={this.share}
                                data-tip="Скопировано!"
                                data-effect="solid"
                                data-delay-hide='2000'
                                data-iscapture={true}
                                data-event='click'>
                            <Share />
                            <span>Скопировать ссылку</span>
                        </button>
                        <ReactTooltip globalEventOff='click' />
                    </div>


                    {/*<button type="button"
                            className={styles.btnSmall}
                            onClick={this.setDefaultParams}>
                        Стандартный поиск
                    </button>*/}
                </div>

                <div className={styles.filters}>
                    {this.state.necessary.length ? <h4>Ключевые слова:</h4> : ''}
                    {this.state.necessary.length ?
                        this.state.necessary.map((keyWord, index) =>
                            <span className={styles.filterParam}
                                  onClick={() => this.removeKeyword('necessary', keyWord)}
                                  key={index}>{keyWord}</span>
                        )
                        :
                        ''
                    }

                    {this.state.unnecessary.length ? <h4>Исключить слова:</h4> : ''}
                    {this.state.unnecessary.length ?
                        this.state.unnecessary.map((keyWord, index) =>
                            <span className={styles.filterParam}
                                  onClick={() => this.removeKeyword('unnecessary', keyWord)}
                                  key={index}>{keyWord}</span>
                        )
                        :
                        ''
                    }



                    {(this.state.necessary.length || this.state.unnecessary.length) ?
                        <button type="button"
                                className={styles.clear}
                                onClick={this.clearKeywords}>
                            Очистить все
                        </button>
                        :
                        ''
                    }
                </div>
            </form>
        );
    }
}
