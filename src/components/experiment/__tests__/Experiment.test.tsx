import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Experiment from '../Experiment';
import { exec } from 'child_process';

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

  it('calls fetch ', async () => {
    let fileList: Array<string> = [];
    const mockResponse = { files: ['some text'] };
    const mockPostResponse = { message: '' };
    const mockGetResponse = { files: ['newFile.py'] };

    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockImplementationOnce((url, params) => {
        {
          json: () => {
            return Promise.resolve(JSON.stringify(mockResponse));
          };
        }
      })
      .mockImplementationOnce((url, params) => {
        {
          json: () => {
            return Promise.resolve(JSON.stringify(mockPostResponse));
          };
        }
      })
      .mockImplementationOnce((url, params) => {
        {
          json: () => {
            return Promise.resolve(JSON.stringify(mockGetResponse));
          };
        }
      });
    let wrapper;
    await act(async () => {
      wrapper = await mount(<Experiment />);
    });
    wrapper.find('input').simulate('change', {
      target: {
        files: [new File([], 'newFile.py')],
      },
    });
    console.log(wrapper.html());
    wrapper.find('.input-group-text').simulate('click');
    wrapper.find('ListGroup.Item');

    fetchMock.mockRestore();
    wrapper.unmount();
  });

  it.only('calls fetch ', async () => {
    let fileList: Array<string> = [];
    const mockResponse = { files: [] };
    const mockPostResponse = { message: '' };
    const mockGetResponse = {
      files: [
        `${process.env.REACT_APP_BACKEND_ADDRESS}/static/experiment/exampleExperiment.py`,
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
      wrapper = await mount(<Experiment />);
    });
    await act(async () => {
      wrapper.find('input').simulate('change', {
        target: {
          files: [new File([], 'newFile.py')],
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
});
