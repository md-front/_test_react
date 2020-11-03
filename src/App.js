import React from 'react';
import Main from './pages/Main';

export default function App(props) {

    return (
        <div>
            <Main regions={props.regions }/>
        </div>
    );
}
