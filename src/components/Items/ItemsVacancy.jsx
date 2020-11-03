import React from 'react';
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
        const haveDescription = vacancy.snippet && vacancy.snippet.requirement && vacancy.snippet.requirement.length > 100;

        return (
            <a href={vacancy.alternate_url}
               className={styles.link}
               onMouseEnter={this.handleMouseHover}
               onMouseLeave={this.handleMouseHover}
               target="_blank"
               rel="noopener noreferrer">
                <span className={styles.text} >
                    <span>{salary && '$'}&nbsp;</span>{vacancy.name}
                </span>

                {this.state.isHover && haveDescription &&
                <div className={styles.popup}>
                    {salary &&
                    <span className={styles.salary}>{salary.from}{salary.from && salary.to ? ' - ' : ''}{salary.to}</span>
                    }
                    {haveDescription &&
                    <span className={styles.description} dangerouslySetInnerHTML={{ __html: this.props.vacancy.snippet.requirement }} />
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
