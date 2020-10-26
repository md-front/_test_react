import React, { Component } from 'react';
import { setLS, getLS } from '../helpers/helpers';
import Header from '../components/Header';
import Items from '../components/Items/Items';

export default class Main extends React.Component {

    constructor(props) {
        super(props);

        /**
         *
         * @type {{favorites: Object, blacklist: Object}}
         * favorites: { 'ekb': [Работодатели] }
         * blacklist: { 'ekb': [Вакансии] }
         */
        this.state = {
            favorites: this.getDataFromStorage('favorites'),
            blacklist: this.getDataFromStorage('blacklist'),
        }

        this.clearItems = this.clearItems.bind(this);
        this.handleClickAction = this.handleClickAction.bind(this);
    }

    isBtnActive(type) {

        for(let location in this.state[type]) {
            if(Object.keys(this.state[type][location]).length) {
                return true;
            }
        }

        return false;
    }

    /** Store actions */
    getDataFromStorage(type) {
        return getLS(type) || this.createEmptyStore(type);
    }
    createEmptyStore() {
        const result = {};

        window.LOCATION_PARAMS.forEach(location => result[location.id] = {})

        return result;
    }


    /** Btn actions */
    handleClickAction(type, sectionId, params) {
        console.log('handleClickAction', type, sectionId, params);

        const result = {...this.state[type]};
        const items = result[sectionId];

        if(items.hasOwnProperty(params.id))
            delete items[params.id];
        else
            items[params.id] = params.groupId;

        this.setItems(type, result);
    }
    clearItems(type) {
        const result = this.createEmptyStore(type);

        this.setItems(type, result);
    }
    setItems(type, payload) {
        this.setState({ [type]: payload });

        setLS(type, payload);
    }

    render() {
        return (
            <div className="main">
                <Header clearItems={this.clearItems}
                        isFavActive={this.isBtnActive('favorites')}
                        isDelActive={this.isBtnActive('blacklist')}/>
                <Items handleClickAction={this.handleClickAction}
                       favorites={this.state.favorites}
                       blacklist={this.state.blacklist} />
            </div>
        );
    }
}