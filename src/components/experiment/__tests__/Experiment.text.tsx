import React from 'react';
import { render } from '@testing-library/react';
import Experiment from '../Experiment';

test('renders file upload input', () => {
    const { getByText } = render(<Experiment />);
    const uploadElement = getByText(/upload/i);
    expect(uploadElement).toBeInTheDocument();
});
