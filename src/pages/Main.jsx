import React, { Component } from 'react';
import { setLS, getLS } from '../helpers';
import Header from '../components/Header';
import Items from '../components/Items/Items';
import Alert from "../components/Alert";

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
            alertShowed: getLS('alert'),
            favorites: this.getDataFromStorage('favorites'),
            blacklist: this.getDataFromStorage('blacklist'),
        }

        this.clearItems = this.clearItems.bind(this);
        this.toggleAlert = this.toggleAlert.bind(this);
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

    toggleAlert() {
        const status = this.state.alertShowed;

        setLS('alert',!status);

        this.setState({ alertShowed: !status })
    }

    /** Store actions */
    getDataFromStorage(type) {
        const storage = getLS(type);
        const empty = this.createEmptyStore(type);

        if(!storage || Object.keys(storage) < Object.keys(empty))
            return empty;
        else
            return storage;
    }
    createEmptyStore() {
        const result = {};

        this.props.locations.forEach(location => result[location.id] = {})

        return result;
    }


    /** Btn actions */
    handleClickAction(type, sectionId, params) {
        const items = {...this.state[type][sectionId]};

        if(items.hasOwnProperty(params.id))
            delete items[params.id];
        else
            items[params.id] = params.parentId;

        const result = {...this.state[type]};

        result[sectionId] = items;

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
            !this.state.alertShowed ?
                <Alert closeAlert={ this.toggleAlert } />
                :
                <div className="main">
                    <Header clearItems={ this.clearItems }
                            isFavActive={ this.isBtnActive('favorites') }
                            isDelActive={ this.isBtnActive('blacklist') }
                            showAlert={ this.toggleAlert }/>

                    <Items handleClickAction={ this.handleClickAction }
                           locations={ this.props.locations }
                           favorites={ this.state.favorites }
                           blacklist={ this.state.blacklist } />
                </div>
        );
    }
}