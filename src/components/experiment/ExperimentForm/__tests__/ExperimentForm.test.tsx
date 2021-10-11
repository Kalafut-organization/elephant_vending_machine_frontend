import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Modal } from 'react-bootstrap';
import ExperimentForm from '../ExperimentForm';

describe('<ExperimentBlock />', () => {
  it('renders without crashing', () => {
    shallow(<ExperimentForm />);
  });

  it('renders a model when the run button is clicked.', async () => {
    const wrapper = shallow(<ExperimentForm />);
    await act(async () => {
      wrapper.find('.form-button').simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(true);
  });

  it('closes the modal when you click run and then cancel', async () => {
    const wrapper = shallow(<ExperimentForm />);
    await act(async () => {
      wrapper.find('.form-button').simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(true);
    await act(async () => {
      wrapper.find('.cancel-form').simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(false);
  });

  it('hides the modal when the modals hide action is triggered.', async () => {
    const wrapper = shallow(<ExperimentForm />);
    await act(async () => {
      wrapper.find('.form-button').simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(true);
    await act(async () => {
      wrapper.find(Modal).simulate('hide');
    });
    expect(wrapper.find(Modal).props().show).toBe(false);
  });
});
