import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Groups from '../Groups';

describe('<Groups />', () => {
  it('renders without crashing', async () => {
    await shallow(<Groups />);
  });

  it('renders an error when fetching groups fails', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.reject(new Error('An error occurred'));
    });

    let wrapper;
    await act(async () => {
      wrapper = await mount(<Groups />);
    });

    const errorDiv = wrapper.find('Row.content');
    expect(errorDiv).toHaveLength(1);
    expect(errorDiv.text()).toEqual('Error encountered while loading groups.');

    fetchMock.mockRestore();
    wrapper.unmount();
  });

  it('renders an info message when no groups returned by server', async () => {
    const mockResponse = {
      files: [],
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve(new Response(JSON.stringify(mockResponse)));
    });

    let wrapper;
    await act(async () => {
      wrapper = await mount(<Groups />);
    });

    expect(wrapper.find('Row.content').text()).toEqual(
      'No groups currently exist.'
    );
    fetchMock.mockRestore();
    wrapper.unmount();
  });

  it('renders groups for each group name returned by API', async () => {
    const mockResponse = {
      names: ['Black', 'White'],
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve(new Response(JSON.stringify(mockResponse)));
    });

    let wrapper;
    await act(async () => {
      wrapper = await mount(<Groups />);
    });

    // This is a terrible way to match the body components. We should find a better selector that works here.
    expect(wrapper.html().match(/mb-4 h-100 card/g)).toHaveLength(2);
    fetchMock.mockRestore();
    wrapper.unmount();
  });

  it('renders text input field', () => {
    const wrapper = shallow(<Groups />);
    expect(wrapper.find('FormControl.text-field')).toHaveLength(1);
  });

  it('renders an upload button', () => {
    const wrapper = shallow(<Groups />);
    expect(wrapper.find('#addButton')).toHaveLength(1);
  });

  it('sends POSTs to the backend and then rerenders the stimuli cards', async () => {
    const mockResponse = { names: [] };
    const mockPostResponse = { message: '' };
    const mockGetResponse = {
      names: ['Black'],
    };

    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockResponse),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockPostResponse),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockGetResponse),
        })
      );
    let wrapper;
    await act(async () => {
      wrapper = await mount(<Groups />);
    });
    await act(async () => {
      wrapper.find('input').simulate('change', {
        target: {
          names: ['Black'],
        },
      });
    });
    await act(async () => {
      wrapper
        .find('#addButton')
        .at(0)
        .simulate('click');
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    fetchMock.mockRestore();
    wrapper.unmount();
  });
});
