import React from 'react';
import { shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Modal from 'react-bootstrap/Modal';
import StimuliCard from '../StimuliCard';

describe('<StimuliCard />', () => {
  it('renders without crashing', () => {
    shallow(
      <StimuliCard url="http://localhost/static/img/some_image_url.jpg" />
    );
  });

  it('renders filename text parsed from URL', () => {
    const wrapper = shallow(
      <StimuliCard url="http://localhost/static/img/some_image_url.jpg" />
    );
    expect(wrapper.contains('some_image_url.jpg')).toEqual(true);
  });

  it('renders error text if URL does not match correct format', () => {
    const wrapper = shallow(
      <StimuliCard url="http://badurl.com/some_image_url.jpg" />
    );
    expect(wrapper.contains('unknown filename')).toEqual(true);
  });

  it('renders view and delete buttons and hidden modal buttons', () => {
    const wrapper = shallow(
      <StimuliCard url="http://localhost/static/img/some_image_url.jpg" />
    );
    const button = wrapper.find('Button');
    expect(button).toHaveLength(4);
    expect(button.at(0).text()).toEqual('View');
    expect(button.at(1).text()).toEqual('Delete');
    expect(button.at(2).text()).toEqual('Cancel');
    expect(button.at(3).text()).toEqual('Delete');
  });

  it('renders an image preview for the url passed as prop', () => {
    const wrapper = shallow(
      <StimuliCard url="http://localhost/static/img/some_image_url.jpg" />
    );
    const image = wrapper.find('CardImg');
    expect(image).toHaveLength(1);
    expect(image.prop('src')).toEqual(
      'http://localhost/static/img/some_image_url.jpg'
    );
  });

  it('renders a model when the delete button is clicked.', async () => {
    const wrapper = shallow(
      <StimuliCard url="http://localhost/static/img/some_stimuli_url.py" />
    );
    await act(async () => {
      wrapper
        .find('Button')
        .at(1)
        .simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(true);
  });

  it('sends delete API call when delete then confirm buttons are pressed', async () => {
    const mockResponse = {
      message: ['mock message'],
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      })
    );
    const windowReloadMock = jest
      .spyOn(window.location, 'reload')
      .mockImplementation(() => {});

    const wrapper = shallow(
      <StimuliCard url="http://localhost/static/experiment/some_experiment_url.py" />
    );
    await act(async () => {
      wrapper
        .find('Button')
        .at(1)
        .simulate('click');
    });
    await act(async () => {
      wrapper
        .find('Button')
        .at(3)
        .simulate('click');
    });
    expect(fetchMock).toHaveBeenCalled();
    expect(windowReloadMock).toHaveBeenCalled();
    fetchMock.mockRestore();
    windowReloadMock.mockRestore();
  });

  it('closes the modal when you click delete and then cancel', async () => {
    const wrapper = shallow(
      <StimuliCard url="http://localhost/static/experiment/some_experiment_url.py" />
    );
    await act(async () => {
      wrapper
        .find('Button')
        .at(1)
        .simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(true);
    await act(async () => {
      wrapper
        .find('Button')
        .at(2)
        .simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(false);
  });

  it('hides the modal when the modals hide action is triggered.', async () => {
    const wrapper = shallow(
      <StimuliCard url="http://localhost/static/experiment/some_experiment_url.py" />
    );
    await act(async () => {
      wrapper
        .find('Button')
        .at(1)
        .simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(true);
    await act(async () => {
      wrapper.find(Modal).simulate('hide');
    });
    expect(wrapper.find(Modal).props().show).toBe(false);
  });
});
