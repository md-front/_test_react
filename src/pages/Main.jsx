import React, { Component } from 'react';
import Header from '../components/Header';
import Items from '../components/Items';

export default class Main extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            favorites: [],
            blacklist: [],
            store: {
                favorites: window.getLS('favorites'),
                blacklist: window.getLS('blacklist')
            }
        }

        this.clearItems = this.clearItems.bind(this);
        this.handleClickAction = this.handleClickAction.bind(this);
    }


    /** Actions */
    handleClickAction(type, newVacancy) {

        if(!this.isContain(type, newVacancy))
            this.addItem(type, newVacancy)
        else
            this.removeItem(type, newVacancy)
    }
    clearItems(type) {
        this.setItems(type,[], []);

        /*const activeClass = `link__text--${this.name}`;
        const activeLinks = document.querySelectorAll(`.${activeClass}`);

        activeLinks.forEach(link => link.classList.remove(activeClass));*/
    }
    setItems(type, payload = this.state[type], storePayload) {
        const test = this.state.store[type];

        this.setState({
            [type]: payload,
            test: storePayload
        });

        window.setLS(type, storePayload);
    }
    isContain(type, newVacancy) {
        return this.state.store[type].includes(newVacancy.id);
    }
    addItem(type, newVacancy) {
        const result = this.state[type];
        result.push(newVacancy);
        const store = this.state.store[type];
        store.push(newVacancy.id);

        this.setItems(type, result, store);
    }
    removeItem(type, newVacancy) {
        const result = this.state[type].filter(vacancy => vacancy !== newVacancy);
        const store = this.state.store[type].filter(id => id !== newVacancy.id);

        this.setItems(type, result, store);
    }


    render() {
        return (
            <div className="main">
                <Header clearItems={this.clearItems}/>
                <Items handleClickAction={this.handleClickAction}
                       store={this.state.store} />
            </div>
        );
    }
}