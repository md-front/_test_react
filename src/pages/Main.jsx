import React from 'react';
import {connect} from "react-redux";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Info from '../components/Info';
import Alert from "../components/Alert";

const Main = ({showAlert}) => (
    showAlert ?
        <Alert />
        :
        <div className="main">
            <Header />
            <Info />
            <Footer/>
        </div>
)

const mapStateToProps = ({app}) => ({
    showAlert: app.showAlert
})

export default connect(mapStateToProps)(Main)