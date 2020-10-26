import React from 'react';
import ItemsVacancy from './ItemsVacancy';

export default function ItemsItem(props) {

    const logoUrl = props.item.items[0].employer.logo_urls;

    let itemClassName = 'item';

    // itemClassName += props.item.items.length > 2 ? ' item--big' : '';
    itemClassName += props.item.salary ? ' item--salary' : '';
    // itemClassName += props.item.is_new ? ' item--new' : '';
    itemClassName += props.item.is_jun ? ' item--jun' : '';

    function toggleFavorite() {
        const params = {
            id: props.item.id,
            parentId: props.item.sort.value
        };

        props.handleClickAction('favorites', params)
    }

    return (
        <div className={itemClassName}>
            <div className="item__title"
                 onClick={ toggleFavorite }
                 title="В избранное">
                <h2>{ props.item.name }</h2>

                { logoUrl && <img src={logoUrl['90']}/> }
            </div>

            <div className="item__inner">
                { props.item.items.map((vacancy, index) =>
                    !vacancy.is_del ?
                        <ItemsVacancy vacancy={vacancy}
                                      key={index}
                                      handleClickAction={props.handleClickAction} />
                        :
                        ''
                )}
            </div>

        </div>
    );
}
