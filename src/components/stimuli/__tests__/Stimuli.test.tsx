import React from 'react';
import ReactDOM from 'react-dom';
import Stimuli from '../Stimuli';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Stimuli />, div);
});
