import React from 'react';
import ItemsVacancy from './ItemsVacancy';

export default function ItemsItem(props) {

    const logoUrl = props.item.items[0].employer.logo_urls;

    let itemClassName = 'item';

    itemClassName += props.item.items.length > 2 ? ' item--big' : '';
    itemClassName += props.item.is_new ? ' item--new' : '';
    itemClassName += props.item.is_jun ? ' item--jun' : '';

    return (
        <div className={itemClassName}>  {/*TODO классы*/}
            <h2>
                { props.item.name }
                { logoUrl ?
                    <img src={logoUrl['90']}/>
                    :
                    ''
                }
            </h2>

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
