import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Stimuli from '../Stimuli';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest
    .fn()
    .mockReturnValue({ environment: 'dev', service: 'fakeService' }),
}));

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

  it('renders an info message when no images returned by server', async () => {
    const mockResponse = {
      files: [],
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve(new Response(JSON.stringify(mockResponse)));
    });

    let wrapper;
    await act(async () => {
      wrapper = await mount(<Stimuli />);
    });

    expect(wrapper.find('Row.content').text()).toEqual(
      'No stimuli files uploaded.'
    );
    fetchMock.mockRestore();
    wrapper.unmount();
  });

  it('renders stimuli cards for each url returned by API', async () => {
    const mockResponse = {
      files: [
        'http://192.168.0.100/static/img/some_image_url.jpg',
        'http://192.168.0.100/static/img/some_other_image_url.jpg',
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

  it('renders file input field with prompt', () => {
    const wrapper = shallow(<Stimuli />);
    const fileInputLabel = wrapper.find('label.custom-file-label').at(0);
    expect(wrapper.find("input[type='file']")).toHaveLength(1);
    expect(fileInputLabel.text()).toEqual('Select a file to upload');
  });

  it('renders an upload button', () => {
    const wrapper = shallow(<Stimuli />);
    expect(wrapper.find('.input-group-text')).toHaveLength(1);
  });

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

  it('sends POSTs to the backend and then rerenders the stimuli cards', async () => {
    const mockResponse = { files: [] };
    const mockPostResponse = { message: '' };
    const mockGetResponse = {
      files: [
        `${process.env.REACT_APP_BACKEND_ADDRESS}/static/img/mockimg.png`,
      ],
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
      wrapper = await mount(<Stimuli />);
    });
    await act(async () => {
      wrapper.find('input').simulate('change', {
        target: {
          files: [new File([], 'mockimg.png')],
        },
      });
    });
    await act(async () => {
      wrapper.find('#uploadButton').simulate('click');
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    fetchMock.mockRestore();
    wrapper.unmount();
  });
});
