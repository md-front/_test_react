import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

it('Рендер футера', () => {
    const footer = render(<Footer />)
    expect(footer).toMatchSnapshot();
});


