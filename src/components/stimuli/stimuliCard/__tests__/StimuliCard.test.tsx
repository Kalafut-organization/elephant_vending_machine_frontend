import React from 'react';
import { shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Modal from 'react-bootstrap/Modal';
import StimuliCard from '../StimuliCard';

const BUTTON_COUNT = 7;

const VIEW_BUTTON_INDEX = 0;
const COPY_TO_FOLDER_BUTTON_INDEX = 1;
const DELETE_BUTTON_INDEX = 2;
const DELETE_MODAL_CANCEL_BUTTON_INDEX = 3;
const DELETE_MODAL_DELETE_BUTTON_INDEX = 4;
const COPY_MODAL_CANCEL_BUTTON_INDEX = 5;
const COPY_MODAL_COPY_BUTTON_INDEX = 6;

const DELETE_MODAL_INDEX = 0;
const COPY_MODAL_INDEX = 1;

describe('<StimuliCard />', () => {
  it('renders without crashing', () => {
    shallow(
      <StimuliCard url="http://192.168.0.100/static/img/some_image_url.jpg" />
    );
  });

  it('renders filename text parsed from URL', () => {
    const wrapper = shallow(
      <StimuliCard url="http://192.168.0.100/static/img/some_image_url.jpg" />
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
      <StimuliCard url="http://192.168.0.100/static/img/some_image_url.jpg" />
    );
    const button = wrapper.find('Button');
    expect(button).toHaveLength(BUTTON_COUNT);
    expect(button.at(VIEW_BUTTON_INDEX).text()).toEqual('View');
    expect(button.at(COPY_TO_FOLDER_BUTTON_INDEX).text()).toEqual(
      'Copy to Folder'
    );
    expect(button.at(DELETE_BUTTON_INDEX).text()).toEqual('Delete');
    expect(button.at(DELETE_MODAL_CANCEL_BUTTON_INDEX).text()).toEqual(
      'Cancel'
    );
    expect(button.at(DELETE_MODAL_DELETE_BUTTON_INDEX).text()).toEqual(
      'Delete'
    );
    expect(button.at(COPY_MODAL_CANCEL_BUTTON_INDEX).text()).toEqual('Cancel');
    expect(button.at(COPY_MODAL_COPY_BUTTON_INDEX).text()).toEqual('Copy');
  });

  it('renders an image preview for the url passed as prop', () => {
    const wrapper = shallow(
      <StimuliCard url="http://192.168.0.100/static/img/some_image_url.jpg" />
    );
    const image = wrapper.find('CardImg');
    expect(image).toHaveLength(1);
    expect(image.prop('src')).toEqual(
      'http://192.168.0.100/static/img/some_image_url.jpg'
    );
  });

  it('renders the delete model when the delete button is clicked.', async () => {
    const wrapper = shallow(
      <StimuliCard url="http://192.168.0.100/static/img/some_stimuli_url.py" />
    );
    await act(async () => {
      wrapper
        .find('Button')
        .at(DELETE_BUTTON_INDEX)
        .simulate('click');
    });
    expect(
      wrapper
        .find(Modal)
        .at(DELETE_MODAL_INDEX)
        .props().show
    ).toBe(true);
  });

  it('renders the copy model when the copy to folder button is clicked.', async () => {
    const wrapper = shallow(
      <StimuliCard url="http://192.168.0.100/static/img/some_stimuli_url.py" />
    );
    await act(async () => {
      wrapper
        .find('Button')
        .at(COPY_TO_FOLDER_BUTTON_INDEX)
        .simulate('click');
    });
    expect(
      wrapper
        .find(Modal)
        .at(COPY_MODAL_INDEX)
        .props().show
    ).toBe(true);
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
      <StimuliCard url="http://192.168.0.100/static/experiment/some_experiment_url.py" />
    );
    await act(async () => {
      wrapper
        .find('Button')
        .at(DELETE_BUTTON_INDEX)
        .simulate('click');
    });
    await act(async () => {
      wrapper
        .find('Button')
        .at(DELETE_MODAL_DELETE_BUTTON_INDEX)
        .simulate('click');
    });
    expect(fetchMock).toHaveBeenCalled();
    expect(windowReloadMock).toHaveBeenCalled();
    fetchMock.mockRestore();
    windowReloadMock.mockRestore();
  });

  it('closes the delete modal when you click delete and then cancel', async () => {
    const wrapper = shallow(
      <StimuliCard url="http://192.168.0.100/static/experiment/some_experiment_url.py" />
    );
    await act(async () => {
      wrapper
        .find('Button')
        .at(DELETE_BUTTON_INDEX)
        .simulate('click');
    });
    expect(
      wrapper
        .find(Modal)
        .at(DELETE_MODAL_INDEX)
        .props().show
    ).toBe(true);
    await act(async () => {
      wrapper
        .find('Button')
        .at(DELETE_MODAL_CANCEL_BUTTON_INDEX)
        .simulate('click');
    });
    expect(
      wrapper
        .find(Modal)
        .at(DELETE_MODAL_INDEX)
        .props().show
    ).toBe(false);
  });

  it('closes the copy modal when you click copy to file and then confirm', async () => {
    const wrapper = shallow(
      <StimuliCard url="http://192.168.0.100/static/experiment/some_experiment_url.py" />
    );
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ file: 'group1' }),
      })
    );
    await act(async () => {
      wrapper
        .find('Button')
        .at(COPY_TO_FOLDER_BUTTON_INDEX)
        .simulate('click');
    });
    expect(
      wrapper
        .find(Modal)
        .at(COPY_MODAL_INDEX)
        .props().show
    ).toBe(true);
    await act(async () => {
      wrapper
        .find('Button')
        .at(COPY_MODAL_COPY_BUTTON_INDEX)
        .simulate('click');
    });
    expect(
      wrapper
        .find(Modal)
        .at(COPY_MODAL_INDEX)
        .props().show
    ).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('closes the copy modal when you click copy to file and then cancel', async () => {
    const wrapper = shallow(
      <StimuliCard url="http://192.168.0.100/static/experiment/some_experiment_url.py" />
    );
    await act(async () => {
      wrapper
        .find('Button')
        .at(COPY_TO_FOLDER_BUTTON_INDEX)
        .simulate('click');
    });
    expect(
      wrapper
        .find(Modal)
        .at(COPY_MODAL_INDEX)
        .props().show
    ).toBe(true);
    await act(async () => {
      wrapper
        .find('Button')
        .at(COPY_MODAL_CANCEL_BUTTON_INDEX)
        .simulate('click');
    });
    expect(
      wrapper
        .find(Modal)
        .at(COPY_MODAL_INDEX)
        .props().show
    ).toBe(false);
  });

  it('hides the delete modal when the modals hide action is triggered.', async () => {
    const wrapper = shallow(
      <StimuliCard url="http://192.168.0.100/static/experiment/some_experiment_url.py" />
    );
    await act(async () => {
      wrapper
        .find('Button')
        .at(DELETE_BUTTON_INDEX)
        .simulate('click');
    });
    expect(
      wrapper
        .find(Modal)
        .at(DELETE_MODAL_INDEX)
        .props().show
    ).toBe(true);
    await act(async () => {
      wrapper
        .find(Modal)
        .at(DELETE_MODAL_INDEX)
        .simulate('hide');
    });
    expect(
      wrapper
        .find(Modal)
        .at(DELETE_MODAL_INDEX)
        .props().show
    ).toBe(false);
  });

  it('hides the copy modal when the modals hide action is triggered.', async () => {
    const wrapper = shallow(
      <StimuliCard url="http://192.168.0.100/static/experiment/some_experiment_url.py" />
    );
    await act(async () => {
      wrapper
        .find('Button')
        .at(COPY_TO_FOLDER_BUTTON_INDEX)
        .simulate('click');
    });
    expect(
      wrapper
        .find(Modal)
        .at(COPY_MODAL_INDEX)
        .props().show
    ).toBe(true);
    await act(async () => {
      wrapper
        .find(Modal)
        .at(COPY_MODAL_INDEX)
        .simulate('hide');
    });
    expect(
      wrapper
        .find(Modal)
        .at(COPY_MODAL_INDEX)
        .props().show
    ).toBe(false);
  });
});
