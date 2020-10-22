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

export default class  ItemsVacancy extends React.Component {
    constructor(props) {
        super(props);

        /*this.state = {
            isFav: this.props.vacancy.is_fav || false,
            isDel: false,
        }*/
    }

    handleClick(e, btnType) {
        e.preventDefault();
        e.stopPropagation();

        /* todo ? Вынести наверх, не менять изнутри. Создавать стейт вакансий?*/
        this.props.vacancy[btnType.type] = !this.props.vacancy[btnType.type];

        this.props.handleClickAction(btnType.name, this.props.vacancy);
    }

    render() {
        return (
            <a href={this.props.vacancy.alternate_url} target="_blank" className="link">
                <span className={`link__text${this.props.vacancy.is_del ? ' link__text--blacklist' : ''}${this.props.vacancy.is_fav ? ' link__text--favorite' : ''}`}>{ this.props.vacancy.name }</span>

                { btns.map((btnType, index) =>
                    <button type="button"
                            key={index}
                            className={`link__btn link__btn--${btnType.name}`}
                            onClick={e => this.handleClick(e, btnType)}/>
                ) }
            </a>
        );
    }
}
