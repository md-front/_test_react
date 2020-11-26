import React from 'react';
import Select from 'rc-select';
import ReactTooltip from 'react-tooltip/dist/index';
import {connect} from 'react-redux'
import {changeNewInDays, clearKeywords, formSubmit} from '../redux/actions/form'
import {changeSelectedRegions} from '../redux/actions/regions'
import KeywordList from './Form/KeywordList';
import KeywordFields from './Form/KeywordFields';
import {ReactComponent as Share} from '../assets/share.svg'
import {ReactComponent as More} from '../assets/search-more.svg'
import {ReactComponent as Info} from '../assets/info.svg'
import styles from '../styles/components/Form.module.scss';
import '../styles/vendor/select.scss';
import {cloneObj} from "../helpers";

const keywordFieldsData = [
    {
        label: 'Добавить ключевое слово',
        id: 'necessary',
        itemsTitle: 'Ключевые слова',
        placeholder: 'js',
        tooltip: 'Название вакансии или работодателя будут содержать хотя-бы одно из ключевых слов',
    },
    {
        label: 'Добавить исключающее слово',
        id: 'unnecessary',
        itemsTitle: 'Исключить слова',
        placeholder: 'php',
        tooltip: 'Названия вакансий с данным словом будут скрыты',
    }
]

const requiredFieldTooltip = 'Обязательно для заполнения'


class Form extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name,
            regions: cloneObj(this.props.regions),
            experience: this.props.experience,
            showMore: true,
            url: '',
        };

        this.share = this.share.bind(this);
        this.toggle = this.toggle.bind(this);
        this.submit = this.submit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.defaultValidation = this.defaultValidation.bind(this);
    }

    defaultValidation() {
        return this.state.name.trim() && this.state.regions.some(region => region.checked) && this.state.experience.some(region => region.checked)
    }

    toggle() {
        this.setState({showMore: !this.state.showMore});
    }

    handleClick(paramName, id) {
        const params = [...this.state[paramName]].map(param => {
            if (param.id === id)
                param.checked = !param.checked;

            return param;
        });

        this.setState({[paramName]: params})
    }

    handleChange(e) {
        this.setState({[e.target.id]: e.target.value})
    }

    submit(e) {
        e.preventDefault();

        this.props.formSubmit({
            name: this.state.name,
            experience: this.state.experience,
            formRegions: this.state.regions
        });
    }

    share() {
        const name = this.state.name.trim().split(' ').join('+');
        const regions = transformToUrlFormat(this.state.regions);
        const experience = transformToUrlFormat(this.state.experience);

        const necessary = this.props.necessary.length ? this.props.necessary.join(',') : null;
        const unnecessary = this.props.unnecessary.length ? this.props.unnecessary.join(',') : null;
        const newInDays = this.props.newInDays.find(option => option.checked).value;

        const url = `${window.location.origin}${window.location.pathname}?name=${name}&regions=${regions}&experience=${experience}&newInDays=${newInDays}${necessary ? '&necessary=' + necessary : ''}${unnecessary ? '&unnecessary=' + unnecessary : ''}`

        window.navigator.clipboard.writeText(url);

        function transformToUrlFormat(arr) {
            return arr.reduce((sum, item) => item.checked ? sum += `${item.id},` : sum, '').slice(0, -1)
        }
    }

    render() {

        return (
            <form className={styles.form}
                  onSubmit={this.submit}>

                <div className={styles.inner}>

                    <label className={styles.item}>
                        <span className={styles.label}>
                            Вакансия
                            <Info data-tip={requiredFieldTooltip}
                                  className={this.state.name ? styles.warningDisabled : styles.warning}
                                  data-type="error"
                                  data-effect="solid"/>

                            <ReactTooltip/>
                        </span>

                        <input className={styles.input}
                               type="text"
                               placeholder="Frontend"
                               id="name"
                               value={this.state.name}
                               onChange={this.handleChange}/>
                    </label>

                    <div className={styles.item}>
                        <div className={styles.label}>
                            Регионы поиска

                            <Info data-tip={requiredFieldTooltip}
                                  className={this.state.regions.some(checkbox => checkbox.checked) ? styles.warningDisabled : styles.warning}
                                  data-type="error"
                                  data-effect="solid"/>

                            <ReactTooltip type="error"/>
                        </div>

                        <div className={styles.checkboxWrap}>
                            {this.state.regions.map((region, index) =>
                                <label key={index}
                                       className={styles.checkbox}>
                                    <input type="checkbox"
                                           checked={region.checked}
                                           onChange={() => this.handleClick('regions', region.id)}
                                           id={region.id}/>
                                    <span/>
                                    <span>{region.name}</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className={styles.item}>
                        <span className={styles.label}>
                            Опыт

                            <Info data-tip={requiredFieldTooltip}
                                  className={this.state.experience.some(checkbox => checkbox.checked) ? styles.warningDisabled : styles.warning}
                                  data-type="error"
                                  data-effect="solid"/>

                            <ReactTooltip/>
                        </span>

                        <div className={styles.checkboxWrap}>
                            {this.state.experience.map((experience, index) =>
                                <label key={index}
                                       className={styles.checkbox}>
                                    <input type="checkbox"
                                           checked={experience.checked}
                                           onChange={() => this.handleClick('experience', experience.id)}
                                           id={experience.id}/>
                                    <span/>
                                    <span>{experience.name}</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className={styles.btns}>
                        <button className={styles.btn}
                                disabled={!this.defaultValidation()}
                                type="submit">Поиск
                        </button>

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
                                       key={index}/>
                    )}

                    <label className={styles.item}>
                        <span className={styles.label}>Учитывать "новые" за</span>

                        <Select id="newInDays"
                                prefixCls="select"
                                defaultValue={this.props.newInDays.find(option => option.checked).value}
                                options={this.props.newInDays}
                                onChange={this.props.changeNewInDays}
                                menuItemSelectedIcon=""
                                showSearch={false}/>
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
                            <Share/>
                            <span>Скопировать ссылку</span>
                        </button>
                        <ReactTooltip globalEventOff='click'/>
                    </div>
                </div>

                <div className={styles.filters}>
                    {keywordFieldsData.map((keywordType, index) =>
                        this.props[keywordType.id].length ?
                            <KeywordList keywordType={keywordType}
                                         keywordsList={this.props[keywordType.id]}
                                         key={index}/>
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

const mapStateToProps = ({form, regions}) => ({
    name: form.name,
    necessary: form.necessary,
    unnecessary: form.unnecessary,
    newInDays: form.newInDays,
    experience: cloneObj(form.experience),
    regions,
})

const mapDispatchToProps = {
    changeNewInDays, clearKeywords, formSubmit, changeSelectedRegions
}

export default connect(mapStateToProps, mapDispatchToProps)(Form)
