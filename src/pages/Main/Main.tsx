import React from 'react';
import { connect } from 'react-redux';
import { Header } from '../../components/Header';
import { MainProps, AppProps } from './Main.types';
import { Footer } from '../../components/Footer';
import { Info } from '../../components/Info';
import { Alert } from '../../components/Alert';
import { Auth } from '../../components/Auth';

function Main({ showAlert, isAuthOpen }: MainProps) {
  if (showAlert) {
    return <Alert />;
  }

  return (
    <div className="main">
      <Header />
      <Info />
      <Footer />
      {isAuthOpen && <Auth />}
    </div>
  );
}

const mapStateToProps = ({ app }: AppProps) => ({
  showAlert: app.showAlert,
  isAuthOpen: app.isAuthOpen,
});

export default connect(mapStateToProps)(Main);
