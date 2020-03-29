import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Stimuli from '../Stimuli';

describe('<Stimuli />', () => {
  it('renders without crashing', async () => {
    await shallow(<Stimuli />);
  });

  it('renders an error when fetching stimuli fails', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.reject(new Error('An error occurred'));
    });

    let wrapper;
    await act(async () => {
      wrapper = await mount(<Stimuli />);
    });

    const errorDiv = wrapper.find('Row');
    expect(errorDiv).toHaveLength(1);
    expect(errorDiv.text()).toEqual('Error encountered while loading images.');

    fetchMock.mockRestore();
    wrapper.unmount();
  });

  it('renders stimuli cards for each url returned by API', async () => {
    const mockResponse = {
      files: [
        'http://localhost/static/img/some_image_url.jpg',
        'http://localhost/static/img/some_other_image_url.jpg',
      ],
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve(new Response(JSON.stringify(mockResponse)));
    });

    let wrapper;
    await act(async () => {
      wrapper = await mount(<Stimuli />);
    });

    // This is a terrible way to match the body components. We should find a better selector that works here.
    expect(wrapper.html().match(/mb-4 h-100 card/g)).toHaveLength(2);
    fetchMock.mockRestore();
    wrapper.unmount();
  });
});
