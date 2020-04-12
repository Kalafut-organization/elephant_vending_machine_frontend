import React from 'react';
import { shallow } from 'enzyme';
import ExperimentItem from '../ExperimentItem';

describe('<ExperimentItem />', () => {
  it('renders without crashing', () => {
    shallow(
      <ExperimentItem url="http://localhost/static/experiment/some_experiment_url.py" />
    );
  });

  it('renders filename text parsed from URL', () => {
    const wrapper = shallow(
      <ExperimentItem url="http://localhost/static/experiment/some_experiment_url.py" />
    );
    expect(wrapper.contains('some_experiment_url.py')).toEqual(true);
  });

  it('renders error text if URL does not match correct format', () => {
    const wrapper = shallow(
      <ExperimentItem url="http://badurl.com/some_experiment_url.py" />
    );
    expect(wrapper.contains('unknown filename')).toEqual(true);
  });

  it('renders a view button, a delete button, and two hidden modal buttons', () => {
    const wrapper = shallow(
      <ExperimentItem url="http://localhost/static/experiment/some_experiment_url.py" />
    );
    const button = wrapper.find('Button');
    expect(button).toHaveLength(4);
  });
});
