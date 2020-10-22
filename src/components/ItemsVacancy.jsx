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

export default function  ItemsVacancy(props) {

    const vacancy = props.vacancy;

    function handleClick(e, btnType) {
        e.preventDefault();
        e.stopPropagation();

        const params = {
            id: vacancy.id,
            groupId: vacancy.employer.id
        };

        props.handleClickAction(btnType.name, params);
    }

    let textClassName = 'link__text';
    textClassName += vacancy.is_del ? ' link__text--blacklist' : '';
    textClassName += vacancy.is_fav ? ' link__text--favorite' : '';

    return (
        <a href={vacancy.alternate_url} target="_blank" className="link">
            <span className={ textClassName }>{ vacancy.name }</span>

            { btns.map((btnType, index) =>
                <button type="button"
                        key={ index }
                        className={`link__btn link__btn--${ btnType.name }`}
                        onClick={e => handleClick(e, btnType)}/>
            ) }
        </a>
    );
}
