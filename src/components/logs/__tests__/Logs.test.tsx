import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ListGroup } from 'react-bootstrap';
import Logs from '../Logs';

describe('<Logs />', () => {
  it('renders without crashing', async () => {
    await shallow(<Logs />);
  });

  it('renders an error when fetching logs fails', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.reject(new Error('An error occurred'));
    });

    let wrapper;
    await act(async () => {
      wrapper = await mount(<Logs />);
    });

    const errorDiv = wrapper.find('ListGroup');
    expect(errorDiv).toHaveLength(1);
    expect(errorDiv.text()).toEqual('Error encountered while loading logs.');

    fetchMock.mockRestore();
    wrapper.unmount();
  });

  it('sends POSTs to the backend and then rerenders the logs list', async () => {
    const mockResponse = { files: [] };
    const mockPostResponse = { message: '' };
    const mockGetResponse = {
      files: [
        `${process.env.REACT_APP_BACKEND_ADDRESS}/static/log/example_log.csv`,
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
      wrapper = await mount(<Logs />);
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    fetchMock.mockRestore();
    wrapper.unmount();
  });

  it('renders log items for each url returned by API', async () => {
    const mockResponse = {
      files: [
        'http://localhost/static/log/some_log_url.csv',
        'http://localhost/static/log/some_other_log_url.csv',
      ],
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      })
    );

    let wrapper;
    await act(async () => {
      wrapper = await mount(<Logs />);
    });

    wrapper.update();
    expect(wrapper.find(ListGroup.Item)).toHaveLength(2);
    fetchMock.mockRestore();
    wrapper.unmount();
  });
});
