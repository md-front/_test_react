import React from 'react';
import Select from 'rc-select';
import ReactTooltip from 'react-tooltip/dist/index';
import {connect} from 'react-redux'
import {changeNew, clearKeywords, deleteKeyword} from '../redux/actions/form'
import {cloneObj} from '../helpers';
import KeywordList from './Form/KeywordList';
import KeywordFields from './Form/KeywordFields';
import {ReactComponent as Share} from '../assets/share.svg'
import {ReactComponent as More} from '../assets/search-more.svg'
// import {ReactComponent as Info} from '../assets/info.svg'
import styles from '../styles/components/Form.module.scss';
import '../styles/vendor/select.scss';

const keywordFieldsData = [
    {
        label: 'Добавить ключевое слово',
        id: 'necessary',
        itemsTitle: 'Ключевые слова',
        placeholder: 'js',
        tooltip: 'Отображаемые вакансии будут содержать хотя-бы одно из ключевых слов',
    },
    {
        label: 'Добавить исключающее слово',
        id: 'unnecessary',
        itemsTitle: 'Исключить слова',
        placeholder: 'php',
        tooltip: 'Названия вакансий с данным словом будут скрыты',
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


class Form extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showMore: true,
            url: '',
            ...this.props.searchParams
        };

        this.share = this.share.bind(this);
        this.toggle = this.toggle.bind(this);
        this.submit = this.submit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.defaultValidation= this.defaultValidation.bind(this);
    }

    defaultValidation() {
        return this.state.name && this.state.regions.some(region => region.checked) && this.state.experience.some(region => region.checked)
    }

    toggle() {
        this.setState({showMore: !this.state.showMore});
    }

    handleChange(e) {
        this.setState({[e.target.id]: e.target.value});
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
            necessary: this.props.necessary,
            unnecessary: this.props.unnecessary,
            newInDays: this.props.newInDays,
        })
    }

    share() {
        const name = this.state.name;
        const necessary = this.props.necessary.length ? this.props.necessary.join(',') : null;
        const unnecessary = this.props.unnecessary.length ? this.props.unnecessary.join(',') : null;
        const newInDays = this.props.newInDays;
        const regions = transformToUrlFormat(this.state.regions);
        const experience = transformToUrlFormat(this.state.experience);

        const url = `${window.location.origin}${window.location.pathname}?name=${name}&regions=${regions}&experience=${experience}&newInDays=${newInDays}${necessary ? '&necessary='+necessary : ''}${unnecessary ? '&unnecessary='+unnecessary : ''}`

        window.navigator.clipboard.writeText(url);

        function transformToUrlFormat(arr) {
            return arr.reduce((sum, item) => item.checked ? sum += `${item.id},` : sum,'').slice(0, -1)
        }
    }

    render() {

        return (
            <form className={styles.form}
                  onSubmit={this.submit}>

                <div className={styles.inner}>
                    <label className={styles.item}>
                        <span className={styles.label}>Вакансия <sup>*</sup></span>

                        <input className={styles.input}
                               type="text"
                               placeholder="Frontend"
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

                    {keywordFieldsData.map((keyword, index) =>
                        <KeywordFields keyword={keyword}
                                       key={index} />
                    )}

                    <label className={styles.item}>
                        <span className={styles.label}>Учитывать "новые" за</span>

                        <Select id="newInDays"
                                prefixCls="select"
                                defaultValue={+this.state.newInDays}
                                options={newInDaysOptions}
                                onChange={this.props.changeNew}
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
                </div>

                <div className={styles.filters}>
                    {keywordFieldsData.map((keywordType ,index) =>
                        this.props[keywordType.id].length ?
                            <KeywordList keywordType={keywordType}
                                         keywordsList={this.props[keywordType.id]}
                                         key={index} />
                            :
                            ''
                    )}

                    {(this.props.necessary.length || this.props.unnecessary.length) ?
                        <button type="button"
                                className={styles.clear}
                                onClick={this.props.clearKeywords}>
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

const mapDispatchToProps = {
    changeNew, deleteKeyword, clearKeywords
}

const mapStateToProps = state => ({
    necessary: state.form.necessary,
    unnecessary: state.form.unnecessary,
    newInDays: state.form.newInDays
})

export default connect(mapStateToProps, mapDispatchToProps)(Form)
