import React from 'react';
import {setLS, getLS} from '../helpers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Items from '../components/Items/Items';
import Alert from "../components/Alert";
import {connect} from "react-redux";
import {showAlert} from "../redux/actions/app";

// /** Store actions */
// getDataFromStorage(type) {
//     const storage = getLS(type);
//     const emptyStorage = this.createEmptyStore();
//
//     if(!storage)
//         return emptyStorage;
//
//     for(let region in emptyStorage) {
//         if(!storage.hasOwnProperty(region))
//             storage[region] = {}
//     }
//
//     return storage;
// }
// createEmptyStore() {
//     const result = {};
//
//     this.props.regions.forEach(region => result[region.id] = {})
//
//     return result;
// }
//
//
// /** Btn actions */
// setStorage(type, payload) {
//     this.setState({[type]: payload});
//
//     setLS(type, payload);
// }

const Main = ({showAlert}) => (
    showAlert ?
        <Alert />
        :
        <div className="main">
            <Header />
            <Items />
            <Footer/>
        </div>
)

const mapStateToProps = ({app}) => ({
    showAlert: app.showAlert
})

export default connect(mapStateToProps)(Main)