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

    const errorDiv = wrapper.find('Row.content');
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

  // Test: Renders file input
  it('renders file input field with prompt', () => {
    const wrapper = shallow(<Stimuli />);
    const fileInputLabel = wrapper.find('label.custom-file-label').at(0);
    expect(wrapper.find("input[type='file']")).toHaveLength(1);
    expect(fileInputLabel.text()).toEqual('Choose an image...');
  });

  // Test: Renders disabled upload button
  it('renders a disabled upload button', () => {
    const wrapper = shallow(<Stimuli />);
    expect(wrapper.find('Button[disabled=true]')).toHaveLength(1);
  });

  // Test: Choosing a file updates the file input label
  it('updates file input label', async () => {
    const wrapper = shallow(<Stimuli />);
    await act(async () => {
      wrapper.find("input[type='file']").simulate('change', {
        target: {
          files: [{ name: 'elephant.jpg' }],
        },
      });
    });
    const fileInputLabel = wrapper.find('label.custom-file-label').at(0);
    expect(fileInputLabel.text()).toEqual('elephant.jpg');
  });

  // Test: Choosing a file enables the upload button
  it('enables upload button', () => {
    const wrapper = shallow(<Stimuli />);
    act(() => {
      wrapper.find("input[type='file']").simulate('change', {
        target: {
          files: [{ name: 'elephant.jpg' }],
        },
      });
    });
    expect(wrapper.find('Button[disabled=false]')).toHaveLength(1);
  });

  it('shows toast with server response message', async () => {
    let wrapper;
    await act(async () => {
      wrapper = await mount(<Stimuli />);
    });

    const mockResponse = {
      message: 'server response',
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve(new Response(JSON.stringify(mockResponse)));
    });

    await act(async () => {
      wrapper.find("input[type='file']").simulate('change', {
        target: {
          files: [{ name: 'elephant.jpg' }],
        },
      });
    });

    await act(async () => {
      wrapper.find('Form').simulate('submit');
    });

    wrapper.update();
    expect(wrapper.find('Toast').text()).toEqual('server response');
    fetchMock.mockRestore();
    wrapper.unmount();
  });

  // Test: Upload button spinner icon while sending
  it('renders spinner icon on upload', async () => {
    let wrapper;
    await act(async () => {
      wrapper = await mount(<Stimuli />);
    });

    const mockResponse = {
      message: 'server response',
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve(new Response(JSON.stringify(mockResponse)));
    });

    await act(async () => {
      wrapper.find("input[type='file']").simulate('change', {
        target: {
          files: [{ name: 'elephant.jpg' }],
        },
      });
    });

    act(() => {
      wrapper.find('Form').simulate('submit');
    });

    wrapper.update();
    expect(wrapper.find('Spinner')).toHaveLength(1);
    fetchMock.mockRestore();
    wrapper.unmount();
  });
});
