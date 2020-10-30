import React from 'react';
import Main from './pages/Main';

export default function App(props) {

    console.clear();


    return (
        <div>
            <Main regions={ props.regions }/>
        </div>
    );
}
