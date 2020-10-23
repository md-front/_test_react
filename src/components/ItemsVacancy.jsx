import React from 'react';
// import fav from '../assets/star.svg';
// import del from '../assets/del.svg';

/* TODO ? как лучше переделать? */
const btns = [
    {
        name: 'favorites',
        type: 'is_fav'
    },
    {
        name: 'blacklist',
        type: 'is_del'
    },
];

export default class ItemsVacancy extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isHover: false
        }

        this.handleMouseHover = this.handleMouseHover.bind(this);
    }

    handleMouseHover() {
        const isHover = !this.state.isHover;

        this.setState({ isHover })
    }

    handleClick(e, btnType) {
        e.preventDefault();
        e.stopPropagation();

        const params = {
            id: this.props.vacancy.id,
            groupId: this.props.vacancy.employer.id
        };

        this.props.handleClickAction(btnType.name, params);
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
                    <span>{ salary && '$' }</span> { vacancy.name }
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

                { btns.map((btnType, index) =>
                    <button type="button"
                            key={ index }
                            className={`link__btn link__btn--${ btnType.name }`}
                            onClick={e => this.handleClick(e, btnType)}/>
                ) }

            </a>
        );
    }
}
