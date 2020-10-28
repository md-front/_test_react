import React from 'react';
import { getLS, setLS } from './helpers';
import Alert from './components/Alert';
import Main from './pages/Main';

export default function App(props) {



    return (
        <div>
            <Main locations={ props.locations }/>
        </div>
    );
}
