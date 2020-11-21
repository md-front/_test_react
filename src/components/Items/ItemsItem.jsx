import React from 'react';
import styles from '../../styles/components/Items/ItemsItem.module.scss';
import ItemsVacancy from './ItemsVacancy';
import {connect} from "react-redux";
import {toggleFavorite} from "../../redux/actions/app";

const ItemsItem = ({item, toggleFavorite}) => {

    const logoUrl = item.items[0].employer.logo_urls;

    return (
        <div className={styles.item}>
            <div className={styles.title}
                 onClick={() => toggleFavorite(item.id)}
                 title="В избранное">
                <h2>{item.name}</h2>

                {logoUrl && <img src={logoUrl['90']} alt="logo"/>}
            </div>

            {item.items.map((vacancy, index) =>
                <ItemsVacancy vacancy={vacancy}
                              key={index} />
            )}

        </div>
    );
}

const mapStateToProps = ({}, {item}) => ({
    item,
})

const mapDispatchToProps = {
    toggleFavorite
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsItem)