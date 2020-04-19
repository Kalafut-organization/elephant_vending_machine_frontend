import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ListGroup } from 'react-bootstrap';
import ExperimentRunner from '../ExperimentRunner';

describe('<ExperimentRunner />', () => {
  it('renders without crashing', async () => {
    await shallow(<ExperimentRunner />);
  });

  it('renders an error when fetching experiments fails', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.reject(new Error('An error occurred'));
    });

    let wrapper;
    await act(async () => {
      wrapper = await mount(<ExperimentRunner />);
    });

    const errorDiv = wrapper.find('ListGroup');
    expect(errorDiv).toHaveLength(1);
    expect(errorDiv.text()).toEqual(
      'Error encountered while loading experiments.'
    );

    fetchMock.mockRestore();
    wrapper.unmount();
  });

  it('renders experiment items for each url returned by API', async () => {
    const mockResponse = {
      files: [
        'http://localhost/static/img/some_image_url.py',
        'http://localhost/static/img/some_other_image_url.py',
      ],
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      })
    );

    let wrapper;
    await act(async () => {
      wrapper = await mount(<ExperimentRunner />);
    });

    wrapper.update();
    expect(wrapper.find(ListGroup.Item)).toHaveLength(2);
    fetchMock.mockRestore();
    wrapper.unmount();
  });
});
