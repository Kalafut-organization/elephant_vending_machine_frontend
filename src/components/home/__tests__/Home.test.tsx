import React from 'react';
import { shallow } from 'enzyme';
import Home from '../Home';

describe('<Home />', () => {
  it('renders without crashing', () => {
    shallow(<Home />);
  });

  it('renders four buttons', () => {
    const wrapper = shallow(<Home />);
    const button = wrapper.find('Button');
    expect(button).toHaveLength(4);
  });

  it('renders the button to run experiments', () => {
    const wrapper = shallow(<Home />);
    const button = wrapper.find('Button').at(0);
    expect(button.text()).toEqual('Run Experiment');
  });

  it('renders the button to manage logs', () => {
    const wrapper = shallow(<Home />);
    const button = wrapper.find('Button').at(1);
    expect(button.text()).toEqual('Manage Logs');
  });

  it('renders the button to manage experiments', () => {
    const wrapper = shallow(<Home />);
    const button = wrapper.find('Button').at(2);
    expect(button.text()).toEqual('Manage Experiments');
  });

  it('renders the button to manage stimuli', () => {
    const wrapper = shallow(<Home />);
    const button = wrapper.find('Button').at(3);
    expect(button.prop('href')).toEqual('/stimuli');
    expect(button.text()).toEqual('Manage Stimuli');
  });
});