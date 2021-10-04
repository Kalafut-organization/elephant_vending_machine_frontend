import React from 'react';
import { shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Modal from 'react-bootstrap/Modal';
import GroupCard from '../GroupCard';

describe('<GroupCard />', () => {
  it('renders without crashing', () => {
    shallow(<GroupCard name="Test" />);
  });

  it('renders view and delete buttons and hidden modal buttons', () => {
    const wrapper = shallow(<GroupCard name="Test" />);
    const button = wrapper.find('Button');
    expect(button).toHaveLength(4);
    expect(button.at(0).text()).toEqual('View');
    expect(button.at(1).text()).toEqual('Delete');
    expect(button.at(2).text()).toEqual('Cancel');
    expect(button.at(3).text()).toEqual('Delete');
  });

  it('renders a model when the delete button is clicked.', async () => {
    const wrapper = shallow(<GroupCard name="Test" />);
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

    const wrapper = shallow(<GroupCard name="Test" />);
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
    const wrapper = shallow(<GroupCard name="Test" />);
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
    const wrapper = shallow(<GroupCard name="Test" />);
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
