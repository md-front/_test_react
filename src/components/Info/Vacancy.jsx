import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {ReactComponent as Del} from '../../assets/del.svg'
import styles from '../../styles/components/Info/Vacancy.module.scss';
import {connect} from "react-redux";
import {addToBlacklist} from "../../redux/actions/app";

class Vacancy extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isHover: false,
        }

        this.renderSalary = this.renderSalary.bind(this);
        this.handleMouseHover = this.handleMouseHover.bind(this);
    }

    handleMouseHover() {
        const isHover = !this.state.isHover;

        this.setState({isHover})
    }

    render() {
        const vacancy = this.props.vacancy;
        const salary = vacancy.salary;
        const validDescription = vacancy.snippet && vacancy.snippet.requirement && vacancy.snippet.requirement.length > 100;

        const highlightClass = classNames({
            text: true,
            'text--exp6': vacancy.exp6,
            'text--exp3': vacancy.exp3,
            'text--is_jun': vacancy.is_jun,
        });


        return (
            <a href={vacancy.alternate_url}
               className={styles.link}
               onMouseEnter={this.handleMouseHover}
               onMouseLeave={this.handleMouseHover}
               target="_blank"
               rel="noopener noreferrer">
                <span className={highlightClass} >
                    {salary && <span className={'isSalary'}>$&nbsp;</span>}
                    {vacancy.name}
                </span>
                {vacancy.is_new && <sup className={styles.new}>&nbsp;NEW</sup>}

                {this.state.isHover && (salary || validDescription) &&
                <div className={'popup'}>
                    {salary && <span className={styles.salary}>{this.renderSalary()}</span> }
                    {validDescription && <span className={styles.description} dangerouslySetInnerHTML={{__html: this.props.vacancy.snippet.requirement }} /> }
                </div>
                }

                <button type="button"
                        className={styles.del}
                        onClick={e => this.props.addToBlacklist(e, vacancy)}>
                    <Del/>
                </button>

            </a>
        );
    }

    renderSalary() {
        const salary = this.props.vacancy.salary
        const usdValue = this.props.usdCurrency;
        let salaryRur;
        let salaryUsd;

        function step(type) {

            const {from, to} = (({from, to, currency}) => {

                if(type === currency)
                    return {from, to}
                else if(type === 'USD')
                    return {from: from / usdValue, to: to / usdValue}
                else
                    return {from: from * usdValue, to: to * usdValue}
            })(salary);

            const formatValue = value => Math.round(value).toLocaleString();

            return (
                <span key={type}
                      className={(usdValue && type === salary.currency) ? styles.presetCurrency : ''}>
                {from ? formatValue(from) : ''}{(from && to) ? ' - ' : ''}{to ? formatValue(to) : ''}&nbsp;{type === 'RUR' ? 'Р' : '$'}
            </span>
            )
        }

        salaryRur = step('RUR')

        if(usdValue)
            salaryUsd = step('USD')

        return [salaryRur, salaryUsd ? salaryUsd : ''];
    }
}

const mapStateToProps = ({app}, {vacancy}) => ({
    vacancy,
    usdCurrency: app.usdCurrency
})

const mapDispatchToProps = {
    addToBlacklist
}

Vacancy.propTypes = {
    vacancy: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Vacancy)