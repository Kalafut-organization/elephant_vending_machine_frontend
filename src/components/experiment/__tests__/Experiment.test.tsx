import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Experiment from '../Experiment';

describe('<Experiment />', () => {
  it('renders without crashing', async () => {
    await shallow(<Experiment />);
  });

  it('renders an error when fetching experiments fails', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.reject(new Error('An error occurred'));
    });

    let wrapper;
    await act(async () => {
      wrapper = await mount(<Experiment />);
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
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve(new Response(JSON.stringify(mockResponse)));
    });

    let wrapper;
    await act(async () => {
      wrapper = await mount(<Experiment />);
    });

    // This is a terrible way to match the body components. We should find a better selector that works here.
    expect(wrapper.html().match(/mr-1/g)).toHaveLength(
      2 * mockResponse.files.length
    );
    fetchMock.mockRestore();
    wrapper.unmount();
  });

  it('handles onClick events for file selector correctly', async () => {
    window.alert = jest.fn();
    let wrapper;
    await act(async () => {
      wrapper = await mount(<Experiment />);
    });
    const clickMock = jest
      .spyOn(wrapper.instance(), 'handleFileSelect')
      .mockImplementation(() => {
        alert('clicked!');
      });
    const uploadField = wrapper.find('Browse');
    uploadField.simulate('click');
    expect(window.alert).toHaveBeenCalledWith('clicked!');
  });
});
