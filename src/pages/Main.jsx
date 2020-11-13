import React from 'react';
import {setLS, getLS} from '../helpers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Items from '../components/Items/Items';
import Alert from "../components/Alert";

export default class Main extends React.Component {

    constructor(props) {
        super(props);

        /**
         *
         * favorites: {'ekb': [{Работодатель: регион}]}
         * blacklist: {'ekb': [{Вакансия: работодатель}]}
         * filtered: {'ekb': [{Работодатель}]}
         */
        this.state = {
            showAlert: false,
            favorites: this.getDataFromStorage('favorites'),
            blacklist: this.getDataFromStorage('blacklist'),
            filtered: this.getDataFromStorage('filtered'),
            /* TODO переделать на местные, и всё завязки делать тут! */
            searchParams: this.props.defaultSearchParams
        }

        this.alertRef = React.createRef();

        this.search = this.search.bind(this);
        this.clearItems = this.clearItems.bind(this);
        this.closeByEsc = this.closeByEsc.bind(this);
        this.toggleAlert = this.toggleAlert.bind(this);
        this.alertClickOutside = this.alertClickOutside.bind(this);
        this.handleClickAction = this.handleClickAction.bind(this);
    }

    search(payload) {
        this.setState({searchParams: {...payload }})
    }

    isBtnActive(type) {

        for(let location in this.state[type]) {
            if(Object.keys(this.state[type][location]).length)
                return true;
        }

        return false;
    }

    /** Alert actions */
    toggleAlert(e) {
        e.stopPropagation()
        const show = this.state.showAlert;

        !show ? this.createAlertHandlers() : this.removeAlertHandlers();

        this.setState({showAlert: !show})
    }
    createAlertHandlers() {
        document.addEventListener('click', this.alertClickOutside)
        document.addEventListener('keydown', this.closeByEsc)
    }
    removeAlertHandlers() {
        document.removeEventListener('click', this.alertClickOutside);
        document.removeEventListener('keydown', this.closeByEsc)
    }
    alertClickOutside(e) {
        const alert = this.alertRef.current;

        if (alert && !alert.contains(e.target))
            this.toggleAlert(e);
    }
    closeByEsc(e) {
        if(e.key === 'Escape')
            this.toggleAlert(e);
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

        this.props.defaultSearchParams.regions.forEach(region => result[region.id] = {})

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
            this.state.showAlert ?
                <Alert alertRef={this.alertRef}
                       closeAlert={this.toggleAlert}/>
                :
                <div className="main">
                    <Header search={this.search}
                            clearItems={this.clearItems}
                            searchParams={this.state.searchParams}
                            isFavActive={this.isBtnActive('favorites')}
                            isDelActive={this.isBtnActive('blacklist')} />

                    <Items filtered={this.state.filtered}
                           favorites={this.state.favorites}
                           blacklist={this.state.blacklist}
                           searchParams={this.state.searchParams}
                           handleClickAction={this.handleClickAction} />

                    <Footer showAlert={this.toggleAlert}/>
                </div>
        );
    }
}