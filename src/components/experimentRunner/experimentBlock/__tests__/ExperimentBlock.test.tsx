import React from 'react';
import { shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Modal } from 'react-bootstrap';
import ExperimentBlock from '../ExperimentBlock';

describe('<ExperimentItem />', () => {
  it('renders without crashing', () => {
    shallow(
      <ExperimentBlock url="http://localhost/static/experiment/some_experiment_url.py" />
    );
  });

  it('renders filename text parsed from URL', () => {
    const wrapper = shallow(
      <ExperimentBlock url="http://localhost/static/experiment/some_experiment_url.py" />
    );
    expect(wrapper.contains('some_experiment_url.py')).toEqual(true);
  });

  it('renders a model when the run button is clicked.', async () => {
    const wrapper = shallow(
      <ExperimentBlock url="http://localhost/static/experiment/some_experiment_url.py" />
    );
    await act(async () => {
      wrapper.find('.run-button').simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(true);
  });

  it('closes the modal when you click run and then cancel', async () => {
    const wrapper = shallow(
      <ExperimentBlock url="http://localhost/static/experiment/some_experiment_url.py" />
    );
    await act(async () => {
      wrapper.find('.run-button').simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(true);
    await act(async () => {
      wrapper.find('.cancel-run').simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(false);
  });

  it('hides the modal when the modals hide action is triggered.', async () => {
    const wrapper = shallow(
      <ExperimentBlock url="http://localhost/static/experiment/some_experiment_url.py" />
    );
    await act(async () => {
      wrapper.find('.run-button').simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(true);
    await act(async () => {
      wrapper.find(Modal).simulate('hide');
    });
    expect(wrapper.find(Modal).props().show).toBe(false);
  });

  it('renders error text if URL does not match correct format', () => {
    const wrapper = shallow(
      <ExperimentBlock url="http://badurl.com/some_experiment_url.py" />
    );
    expect(wrapper.contains('unknown filename')).toEqual(true);
  });

  it('renders a run button and two hidden modal buttons', () => {
    const wrapper = shallow(
      <ExperimentBlock url="http://localhost/static/experiment/some_experiment_url.py" />
    );
    const button = wrapper.find('Button');
    expect(button).toHaveLength(3);
  });
});
