import React from 'react';
import { shallow } from 'enzyme';
import NotFound from '../NotFound';

describe('<NotFound />', () => {
  it('renders without crashing', () => {
    shallow(<NotFound />);
  });

  it('renders 404 text', () => {
    const wrapper = shallow(<NotFound />);
    expect(wrapper.text()).toEqual('404 Page Not Found');
  });
});
