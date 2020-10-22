import React from 'react';
import ItemsVacancy from './ItemsVacancy';

export default function ItemsItem(props) {

    const logoUrl = props.item.items[0].employer.logo_urls

    return (
        <div className="item">  {/*TODO классы*/}
            <h2>
                { props.item.name }
                { logoUrl ?
                    <img src={logoUrl['90']}/>
                    :
                    ''
                }
            </h2>

            { props.item.items.map((vacancy, index) =>
                !vacancy.is_del ?
                    <ItemsVacancy vacancy={vacancy}
                              key={index}
                              handleClickAction={props.handleClickAction} />
                              :
                    ''
            )}

        </div>
    );
}
