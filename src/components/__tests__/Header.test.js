import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../Header';

it('Рендер', () => {
    const header = render(<Header />)
    expect(header).toMatchSnapshot();
    expect(screen.getByText('Поиск вакансий')).toBeInTheDocument();
});