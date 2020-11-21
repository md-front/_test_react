import React from 'react';
import {setLS, getLS} from '../helpers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Items from '../components/Items/Items';
import Alert from "../components/Alert";
import {connect} from "react-redux";

class Main extends React.Component {

    constructor(props) {
        super(props);

        /**
         *
         * favorites: {'ekb': [{Работодатель: регион}]}
         * blacklist: {'ekb': [{Вакансия: работодатель}]}
         * filtered: {'ekb': [{id_группы}]}
         */
        this.state = {
            favorites: this.getDataFromStorage('favorites'),
            blacklist: this.getDataFromStorage('blacklist'),
            filtered: this.getDataFromStorage('filtered'),
        }

        this.clearItems = this.clearItems.bind(this);
        this.handleClickAction = this.handleClickAction.bind(this);
    }

    isBtnActive(type) {

        for(let location in this.state[type]) {
            if(Object.keys(this.state[type][location]).length)
                return true;
        }

        return false;
    }

    /** Store actions */
    getDataFromStorage(type) {
        const storage = getLS(type);
        const emptyStorage = this.createEmptyStore();

        if(!storage)
            return emptyStorage;

        for(let region in emptyStorage) {
            if(!storage.hasOwnProperty(region))
                storage[region] = {}
        }

        return storage;
    }
    createEmptyStore() {
        const result = {};

        this.props.regions.forEach(region => result[region.id] = {})

        return result;
    }


    /** Btn actions */
    handleClickAction(type, sectionId, params) {
        const items = {...this.state[type][sectionId]};

        if(items.hasOwnProperty(params.id))
            delete items[params.id];
        else
            items[params.id] = params.parentId || 0;

        const result = {...this.state[type]};

        result[sectionId] = items;

        this.setStorage(type, result);
    }
    clearItems(type) {
        const result = this.createEmptyStore();

        this.setStorage(type, result);
    }
    setStorage(type, payload) {
        this.setState({[type]: payload});

        setLS(type, payload);
    }


    render() {
        return (
            this.props.showAlert ?
                <Alert />
                :
                <div className="main">
                    <Header clearItems={this.clearItems}
                            isFavActive={this.isBtnActive('favorites')}
                            isDelActive={this.isBtnActive('blacklist')} />

                    <Items filtered={this.state.filtered}
                           favorites={this.state.favorites}
                           blacklist={this.state.blacklist}
                           handleClickAction={this.handleClickAction} />
                    {/* TODO handleClickAction - to favorite */}

                    <Footer/>
                </div>
        );
    }
}

const mapStateToProps = ({regions, app}) => ({
    regions,
    showAlert: app.showAlert
})

export default connect(mapStateToProps)(Main)