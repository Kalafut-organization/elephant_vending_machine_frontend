import React from 'react';
import { shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Modal } from 'react-bootstrap';
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

  it('renders a model when the delete button is clicked.', async () => {
    const wrapper = shallow(
      <ExperimentItem url="http://localhost/static/experiment/some_experiment_url.py" />
    );
    await act(async () => {
      wrapper.find('.delete-button').simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(true);
  });

  it('Clicking delete and then delete again issues a fetch', async () => {
    const mockResponse = {
      message: ['this is a message'],
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      })
    );
    const mockWindowReload = jest
      .spyOn(window.location, 'reload')
      .mockImplementation(() => {});

    const wrapper = shallow(
      <ExperimentItem url="http://localhost/static/experiment/some_experiment_url.py" />
    );
    await act(async () => {
      wrapper.find('.delete-button').simulate('click');
    });
    await act(async () => {
      wrapper.find('.confirm-delete').simulate('click');
    });
    expect(fetchMock).toHaveBeenCalled();
    expect(mockWindowReload).toHaveBeenCalled();
    fetchMock.mockRestore();
    mockWindowReload.mockRestore();
  });

  it('closes the modal when you click delete and then cancel', async () => {
    const wrapper = shallow(
      <ExperimentItem url="http://localhost/static/experiment/some_experiment_url.py" />
    );
    await act(async () => {
      wrapper.find('.delete-button').simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(true);
    await act(async () => {
      wrapper.find('.cancel-delete').simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(false);
  });

  it('hides the modal when the modals hide action is triggered.', async () => {
    const wrapper = shallow(
      <ExperimentItem url="http://localhost/static/experiment/some_experiment_url.py" />
    );
    await act(async () => {
      wrapper.find('.delete-button').simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(true);
    await act(async () => {
      wrapper.find(Modal).simulate('hide');
    });
    expect(wrapper.find(Modal).props().show).toBe(false);
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
