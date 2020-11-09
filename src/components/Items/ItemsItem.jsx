import React from 'react';
import styles from '../../styles/components/Items/ItemsItem.module.scss';
import ItemsVacancy from './ItemsVacancy';

export default function ItemsItem(props) {

    const logoUrl = props.item.items[0].employer.logo_urls;

    function toggleFavorite() {
        const params = {
            id: props.item.id,
            parentId: props.item.sort.value
        };

        props.handleClickAction('favorites', params)
    }

    return (
        <div className={props.item.is_jun ? styles.jun : styles.item}>
            <div className={styles.title}
                 onClick={toggleFavorite}
                 title="В избранное">
                <h2>{props.item.name}</h2>

                {logoUrl && <img src={logoUrl['90']} alt="logo" loading="lazy"/>}
            </div>

            {props.item.items.map((vacancy, index) =>
                !vacancy.is_del &&
                <ItemsVacancy vacancy={vacancy}
                              key={index}
                              handleClickAction={props.handleClickAction} />
            )}

        </div>
    );
}
