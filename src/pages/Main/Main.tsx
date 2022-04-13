import React from 'react';
import { connect } from 'react-redux';
import { Header } from '../../components/Header';
import { MainProps, AppProps } from './Main.types';
import { Footer } from '../../components/Footer';
import { Info } from '../../components/Info';
import { Alert } from '../../components/Alert';

function Main({ showAlert }: MainProps) {
  return showAlert
    ? <Alert />
    : (
      <div className="main">
        <Header />
        <Info />
        <Footer />
      </div>
    );
}

const mapStateToProps = ({ app }: AppProps) => ({
  showAlert: app.showAlert,
});

export default connect(mapStateToProps)(Main);
