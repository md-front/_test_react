import React from 'react';
import classNames from 'classnames';
import {ReactComponent as Del} from '../../assets/del.svg'
import styles from '../../styles/components/Items/ItemsVacancy.module.scss';

export default class ItemsVacancy extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isHover: false,
        }

        this.toggleBlacklist = this.toggleBlacklist.bind(this);
        this.handleMouseHover = this.handleMouseHover.bind(this);
    }

    handleMouseHover() {
        const isHover = !this.state.isHover;

        this.setState({isHover})
    }

    toggleBlacklist(e) {
        e.preventDefault();
        e.stopPropagation();

        const params = {
            id: this.props.vacancy.id,
            parentId: this.props.vacancy.employer.id
        };

        this.props.handleClickAction('blacklist', params);
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
            // 'text--is_new': vacancy.is_new,
            // 'text--is_salary': vacancy.is_salary,
        });

        console.log('vacancyClass:',highlightClass)

        return (
            <a href={vacancy.alternate_url}
               className={styles.link}
               onMouseEnter={this.handleMouseHover}
               onMouseLeave={this.handleMouseHover}
               target="_blank"
               rel="noopener noreferrer">
                <span className={highlightClass} >
                    {salary &&
                        <span className={'isSalary'}>$&nbsp;</span>
                    }
                    {vacancy.name}
                </span>
                {vacancy.is_new &&
                <sup className={styles.new}>
                    &nbsp;NEW
                </sup>
                }

                {this.state.isHover && (salary || validDescription) &&
                <div className={'popup'}>
                    {salary &&
                    <span className={styles.salary}>{salary.from}{salary.from && salary.to ? ' - ' : ''}{salary.to} {salary.currency === 'RUR' ? 'Р' : '$'}</span>
                    }
                    {validDescription &&
                    <span className={styles.description} dangerouslySetInnerHTML={{__html: this.props.vacancy.snippet.requirement }} />
                    }
                </div>
                }

                <button type="button"
                        className={styles.del}
                        onClick={this.toggleBlacklist}>
                    <Del/>
                </button>

            </a>
        );
    }
}
