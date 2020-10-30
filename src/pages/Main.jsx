import React from 'react';
import { setLS, getLS } from '../helpers';
import Header from '../components/Header';
import Footer from '../components/Footer';
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
            showAlert: false,
            favorites: this.getDataFromStorage('favorites'),
            blacklist: this.getDataFromStorage('blacklist'),
            filtered: this.getDataFromStorage('filtered'),
        }

        this.alertRef = React.createRef();

        this.clearItems = this.clearItems.bind(this);
        this.closeByEsc = this.closeByEsc.bind(this);
        this.toggleAlert = this.toggleAlert.bind(this);
        this.alertClickOutside = this.alertClickOutside.bind(this);
        this.handleClickAction = this.handleClickAction.bind(this);
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

        this.setState({ showAlert: !show })
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
        const empty = this.createEmptyStore(type);

        if(!storage || Object.keys(storage) < Object.keys(empty))
            return empty;
        else
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

        this.setItems(type, result);
    }
    clearItems(type) {
        const result = this.createEmptyStore(type);

        this.setItems(type, result);
    }
    setItems(type, payload) {
        this.setState({ [type]: payload });

        console.log('setItems',type, payload)

        setLS(type, payload);
    }


    render() {
        return (
            this.state.showAlert ?
                <Alert closeAlert={ this.toggleAlert } alertRef={ this.alertRef }/>
                :
                <div className="main">
                    <Header clearItems={ this.clearItems }
                            isFavActive={ this.isBtnActive('favorites') }
                            isDelActive={ this.isBtnActive('blacklist') } />

                    <Items handleClickAction={ this.handleClickAction }
                           regions={ this.props.regions }
                           filtered={ this.state.filtered }
                           favorites={ this.state.favorites }
                           blacklist={ this.state.blacklist } />

                   <Footer showAlert={ this.toggleAlert }/>
                </div>
        );
    }
}