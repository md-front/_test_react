import React from 'react';
// import fav from '../assets/star.svg';
// import del from '../assets/del.svg';

export default class ItemsVacancy extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isHover: false
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleMouseHover = this.handleMouseHover.bind(this);
    }

    handleMouseHover() {
        const isHover = !this.state.isHover;

        this.setState({ isHover })
    }

    handleClick(e) {
        e.preventDefault();
        e.stopPropagation();

        this.props.handleClickAction('blacklist', this.props.vacancy.id);
    }

    render() {
        const vacancy = this.props.vacancy;
        const salary = vacancy.salary;

        let textClassName = 'link__text';
        textClassName += vacancy.is_fav ? ' link__text--favorite' : '';

        return (
            <a href={ vacancy.alternate_url }
               className="link"
               onMouseEnter={this.handleMouseHover}
               onMouseLeave={this.handleMouseHover}
               target="_blank" >

                <span className={ textClassName }>
                    <span>{ salary && '$' }&nbsp;</span>{ vacancy.name }
                </span>

                { this.state.isHover &&
                    <span className="link__popup">
                        { salary &&
                            <span className="link__salary">{ salary.from }{ salary.from && salary.to ? ' - ' : '' }{ salary.to }</span>
                        }
                        { vacancy.snippet && vacancy.snippet.requirement &&
                            <span className="link__description">{ vacancy.snippet.requirement }</span>
                        }
                    </span>
                }

                <button type="button"
                        className="link__del"
                        onClick={ this.handleClick }/>

            </a>
        );
    }
}
