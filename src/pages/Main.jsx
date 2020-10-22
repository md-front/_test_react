import React, { Component } from 'react';
import Header from '../components/Header';
import Items from '../components/Items';

export default class Main extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            favorites: window.getLS('favorites'),
            blacklist: window.getLS('blacklist')
        }

        this.clearItems = this.clearItems.bind(this);
        this.handleClickAction = this.handleClickAction.bind(this);
    }

    /** Actions */
    handleClickAction(type, params) {
        const items = {...this.state[type]};

        if(items.hasOwnProperty(params.id))
            delete items[params.id];
        else
            items[params.id] = params.groupId;

        this.setItems(type, items);
    }
    clearItems(type) {
        this.setItems(type,{}, {});

        // window.location.reload();
    }
    setItems(type, payload = this.state[type]) {
        this.setState({ [type]: payload });

        window.setLS(type, payload);
    }


    render() {
        return (
            <div className="main">
                <Header clearItems={this.clearItems}
                        isFavActive={!!Object.entries(this.state.favorites).length}
                        isDelActive={!!Object.entries(this.state.blacklist).length}/>
                <Items handleClickAction={this.handleClickAction}
                       favorites={this.state.favorites}
                       blacklist={this.state.blacklist} />
            </div>
        );
    }
}