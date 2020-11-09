import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import REGIONS_PARAMS from '../REGIONS_PARAMS'

it('Рендер всего приложения', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App regions={REGIONS_PARAMS } />, div);
});

// expect(screen.getByText('Learn React')).toBeInTheDocument();