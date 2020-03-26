import React from 'react';
import ReactDOM from 'react-dom';
import StimuliCard from '../StimuliCard';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<StimuliCard url="someurl.com" />, div);
});
