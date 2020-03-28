import React from 'react';
import { shallow } from 'enzyme';
import fetchMock from 'jest-fetch-mock';
import Stimuli from '../Stimuli';

describe('<Stimuli />', () => {
  it('renders without crashing', async () => {
    await shallow(<Stimuli />);
  });

  it.skip('renders an error when fetching stimuli fails', async () => {
    const mockResponse = {
      files: [
        'http://localhost/static/img/some_image_url.jpg',
        'http://localhost/static/img/some_other_image_url.jpg',
      ],
    };
    fetchMock.mockRejectOnce(new Error('Some error'));
    const wrapper = await shallow(<Stimuli />);
    const errorDiv = wrapper.find('Row').find('div');
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(errorDiv).toHaveLength(1);
    expect(errorDiv.text()).toEqual('Error encountered while loading images.');
  });
});
