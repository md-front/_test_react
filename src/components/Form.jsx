import React from 'react';
import {cloneObj} from '../helpers';
import {ReactComponent as Share} from '../assets/share.svg'
import {ReactComponent as More} from '../assets/search-more.svg'
import styles from '../styles/components/Form.module.scss';

export default class Form extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showMore: true,
            copiedUrl: '',
            necessaryInput: '',
            unnecessaryInput: '',
            // url,
            ...this.props.searchParams
        };

        // this.defaultParams = this.props.searchParams;

        this.share = this.share.bind(this);
        this.toggle = this.toggle.bind(this);
        this.submit = this.submit.bind(this);
        this.addKeyword = this.addKeyword.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSelect= this.handleSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.clearKeywords= this.clearKeywords.bind(this);
        this.defaultValidation= this.defaultValidation.bind(this);
        // this.setDefaultParams = this.setDefaultParams.bind(this);
    }

    componentDidMount() {
        this.setUrl();
    }

    defaultValidation() {
        return !this.state.name || !this.state.regions.some(region => region.checked)
    }

    clearKeywords() {
        this.setState({
            necessary: [],
            unnecessary: [],
        }, this.setUrl)
    }

    setUrl() {
        const name = this.state.name;
        const necessary = this.state.necessary.length ? this.state.necessary.join(',') : null;
        const unnecessary = this.state.unnecessary.length ? this.state.unnecessary.join(',') : null;
        const newInDays = this.state.newInDays;
        const regions = this.state.regions.reduce((activeRegions, region) => region.checked ? activeRegions += `${region.id},` : activeRegions,'').slice(0, -1);

        const url = `${window.location.origin}${window.location.pathname}?name=${name}&regions=${regions}&newInDays=${newInDays}${necessary ? '&necessary='+necessary : ''}${unnecessary ? '&unnecessary='+unnecessary : ''}`

        this.setState({'url': url});
    }

    toggle() {
        this.setState({showMore: !this.state.showMore});
    }

    handleChange(e) {
        const callback = e.target.id === 'name' ? this.setUrl : '';

        this.setState({[e.target.id]: e.target.value}, callback);
    }

    handleSelect(e) {
        this.setState({[e.target.id]: e.target.value}, this.setUrl);
    }

    addKeyword(id) {
        const inputName = `${id}Input`
        const inputValue = this.state[inputName];
        const keywords = [...this.state[id]];

        if(!keywords.includes(inputValue))
            keywords.push(inputValue)

        this.setState({
            [id]: keywords,
            [inputName]: ''
        }, this.setUrl)
    }

    removeKeyword(id, value) {
        let keywords = [...this.state[id]];
        keywords = keywords.filter(keyword => keyword !== value);

        this.setState({[id]: keywords})

        this.setUrl();
    }

    handleClick(e) {
        const regions = cloneObj(this.state.regions);
        const region = regions.find(region => region.id === e.target.id);
        region.checked = !region.checked;

        if(region.is_active)
            region.is_active = false;

        this.setState({regions}, this.setUrl)
    }

    submit(e) {
        e.preventDefault();

        this.props.search({
            name: this.state.name,
            necessary: this.state.necessary,
            unnecessary: this.state.unnecessary,
            regions: this.state.regions,
            newInDays: this.state.newInDays,
        })
    }

    /*setDefaultParams() {
        this.setState({...this.defaultParams})
    }*/

    share() {
        window.navigator.clipboard.writeText(this.state.url)

        this.setState({copiedUrl: this.state.url})
    }

    render() {
        const keyWordFields = [
            {
                label: 'Добавить ключевое слово',
                id: 'necessary',
                placeholder: 'Кадрам',
                value: this.state.necessaryInput,
            },
            {
                label: 'Добавить исключающее ключевое слово',
                id: 'unnecessary',
                placeholder: 'Продажам',
                value: this.state.unnecessaryInput,
            }
        ]

        const newInDaysOptions = [
            {
                value: 1,
                title: '1 день'
            },
            {
                value: 2,
                title: '2 дня'
            },
            {
                value: 3,
                title: '3 дня'
            },
            {
                value: 7,
                title: '1 неделю'
            },
            {
                value: 14,
                title: '2 недели'
            },
        ]

        return (
            <form className={styles.form}
                  onSubmit={this.submit}>

                <div className={styles.inner}>
                    <label>
                        <span className={styles.label}>Вакансия:</span>

                        <input className={styles.input}
                               type="text"
                               placeholder="Менеджер"
                               id="name"
                               value={this.state.name}
                               onChange={this.handleChange}/>
                    </label>

                    <div className={styles.regions}>
                        <div className={styles.label}>Регионы поиска:</div>

                        <div className={styles.regionsInner}>
                            {this.state.regions.map((region, index) =>
                                <label key={index}>
                                    <input type="checkbox"
                                           checked={region.checked}
                                           onChange={this.handleClick}
                                           id={region.id}/>
                                    <span/>
                                    <span>{region.name}</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className={styles.btns}>
                        {/* TODO this.state.regions.some оптимизировать */}
                        <button className={styles.btn}
                                disabled={this.defaultValidation()}
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
                            <span className={styles.label}>{keyWord.label}</span>

                            <input className={styles.input}
                                   type="text"
                                   id={keyWord.id+'Input'}
                                   placeholder={keyWord.placeholder}
                                   value={keyWord.value}
                                   onChange={this.handleChange}/>

                            <button type="button"
                                    className={styles.btnKeyword}
                                    disabled={!keyWord.value}
                                    onClick={() => this.addKeyword(keyWord.id)}>+</button>
                        </label>
                    )}

                    <label>
                        <span className={styles.label}>Учитывать "новые" за</span>
                        <select id="newInDays"
                                onChange={this.handleSelect}>
                            {newInDaysOptions.map((option, index) =>
                                <option value={option.value}
                                        key={index}
                                        selected={+this.state.newInDays === option.value}>
                                    {option.title}
                                </option>
                            )}
                        </select>
                    </label>


                    <div className={styles.btns}>
                        {this.state.url === this.state.copiedUrl ?
                            <button type="button"
                                    disabled
                                    className={styles.btnCopy}>
                                <span>Скопировано!</span>
                            </button>
                            :
                            <button type="button"
                                    className={styles.btnCopy}
                                    disabled={this.defaultValidation()}
                                    onClick={this.share}>
                                <Share />
                                <span>Скопировать ссылку</span>
                            </button>
                        }
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
