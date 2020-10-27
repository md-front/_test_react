import React from 'react';
import './App.css';
import Main from './pages/Main';

export default function App(props) {

  return (
    <div>
        <Main locations={ props.locations }/>
    </div>
  );
}
