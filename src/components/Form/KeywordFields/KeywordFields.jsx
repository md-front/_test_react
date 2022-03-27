import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip/dist/index';
import {connect} from "react-redux";
import {ReactComponent as Info} from '../../../assets/info.svg'
import {addKeyword, deleteKeyword} from '../../../redux/actions/form'
import styles from '../Form.module.scss';


class KeywordFields extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            input: '',
            tooltip: {
                type: '',
                text: ''
            }
        }
        
        this.addKeyword = this.addKeyword.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.listenSubmit = this.listenSubmit.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
        this.removeListenSubmit = this.removeListenSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({input: e.target.value});
    }

    listenSubmit() {
        document.addEventListener('keydown', this.keydownHandler)
    }

    removeListenSubmit() {
        document.removeEventListener('keydown', this.keydownHandler)
    }

    keydownHandler(e) {
        if(e.key === 'Enter')
            this.addKeyword();
    }

    addKeyword() {
        const name = this.props.keyword.id;
        const inputValue = this.state.input.trim();
        const keywords = this.props[name];
        const diffName = ['necessary','unnecessary'].find(difName => difName !== name);
        let differentKeywords = this.props[diffName];
        let tooltip = {};

        const removeFromDifferentKeywords = () => {
            if(!differentKeywords.includes(inputValue)) return;
            differentKeywords = differentKeywords.filter(keyword => keyword.toLowerCase() !== inputValue.toLowerCase());

            this.props.deleteKeyword(diffName, inputValue);

            tooltip = {
                type: 'dark',
                text: `"${inputValue}" перенесено из ${diffName === 'necessary' ? 'ключевых слов' : 'исключающих слов'}`
            }
        }
        const showTooltip = () => {
            if(!this.state.tooltip.text) return;

            const tooltip = this[`${name}Tooltip`];

            ReactTooltip.show(tooltip);

            setTimeout(()=>{
                ReactTooltip.hide(tooltip);
                this.setState({
                    tooltip: {
                        type: '',
                        text: ''
                    }
                })
            },2000);
        }

        if(!keywords.some(keyword => keyword.toLowerCase() === inputValue.toLowerCase())) {
            this.props.addKeyword(name, inputValue);

            removeFromDifferentKeywords();
        } else {
            tooltip = {
                type: 'error',
                text: `"${inputValue}" уже присутствует в фильтре`
            }
        }

        this.setState({
            input: '',
            tooltip
        }, showTooltip)
    }

    render() {
        const keyword = this.props.keyword;

        return (
            <label className={styles.keyword}>
                <span className={styles.label}>
                    {keyword.label} <Info data-tip={keyword.tooltip}
                                          data-effect="solid"/>
                    <ReactTooltip />
                </span>

                <input className={styles.input}
                       type="text"
                       id={keyword.id+'Input'}
                       placeholder={keyword.placeholder}
                       value={this.state.input}
                       onFocus={this.listenSubmit}
                       onBlur={this.removeListenSubmit}
                       onChange={this.handleChange}/>

                <button type="button"
                        className={styles.btnKeyword}
                        disabled={!this.state.input.trim()}
                        onClick={this.addKeyword}
                        data-tip={this.state.tooltip.text}
                        data-type={this.state.tooltip.type}
                        data-effect="solid"
                        data-iscapture={true}
                        ref={ref => {this[`${keyword.id}Tooltip`] = ref}}
                        data-event='custom'>+</button>
                <ReactTooltip />
            </label>
        )
    }
}

const mapDispatchToProps = {
    addKeyword, deleteKeyword
}

const mapStateToProps = state => ({
    necessary: state.form.necessary,
    unnecessary: state.form.unnecessary,
})

KeywordFields.propTypes = {
    keyword: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(KeywordFields)
