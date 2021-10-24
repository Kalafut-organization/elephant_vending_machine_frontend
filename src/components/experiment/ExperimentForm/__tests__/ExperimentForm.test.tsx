import React from 'react';
import { mount, ReactWrapper, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Modal } from 'react-bootstrap';
import ExperimentForm from '../ExperimentForm';

describe('<ExperimentBlock />', () => {
  it('renders without crashing', () => {
    shallow(<ExperimentForm />);
  });

  it('renders a model when the run button is clicked.', async () => {
    const wrapper = shallow(<ExperimentForm />);
    await act(async () => {
      wrapper.find('.create-form-button').simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(true);
  });

  it('closes the modal when you click cancel', async () => {
    const wrapper = shallow(<ExperimentForm />);
    await act(async () => {
      wrapper.find('.create-form-button').simulate('click');
    });
    await act(async () => {
      wrapper.find('.confirm-form').simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(true);
    await act(async () => {
      wrapper.find('.cancel-form').simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(false);
  });

  it('hides the modal when the modals hide action is triggered.', async () => {
    const wrapper = shallow(<ExperimentForm />);
    await act(async () => {
      wrapper.find('.create-form-button').simulate('click');
    });
    expect(wrapper.find(Modal).props().show).toBe(true);
    await act(async () => {
      wrapper.find(Modal).simulate('hide');
    });
    expect(wrapper.find(Modal).props().show).toBe(false);
  });

  it('name updates on change', async () => {
    const wrapper = shallow(<ExperimentForm />);
    await act(async () => {
      wrapper.find('.create-form-button').simulate('click');
      wrapper.find('.confirm-form').simulate('click');
    });
    expect(wrapper.find('#name-error')).toBeTruthy();
    await act(async () => {
      wrapper.find('.name-text').simulate('change', {
        target: {
          value: 'Experiment 1',
        },
      });
    });
    expect(wrapper.contains('.text-error')).toEqual(false);
  });

  it('fixation updates on change', async () => {
    const wrapper = shallow(<ExperimentForm />);
    await act(async () => {
      wrapper.find('.create-form-button').simulate('click');
      wrapper.find('.confirm-form').simulate('click');
    });
    expect(wrapper.find('#fixation-error')).toBeTruthy();
    await act(async () => {
      wrapper.find('.fixation-field').simulate('change', {
        target: {
          value: '10',
        },
      });
    });
    expect(wrapper.contains('.fixation-error')).toEqual(false);
  });

  it('intermediate field updates on change', async () => {
    const wrapper = shallow(<ExperimentForm />);
    await act(async () => {
      wrapper.find('.create-form-button').simulate('click');
      wrapper.find('.confirm-form').simulate('click');
    });
    expect(wrapper.find('#intermediate-error')).toBeTruthy();
    await act(async () => {
      wrapper.find('.intermediate-field').simulate('change', {
        target: {
          value: '10',
        },
      });
    });
    expect(wrapper.contains('.intermediate-error')).toEqual(false);
  });

  it('stimuli duration field updates on change', async () => {
    const wrapper = shallow(<ExperimentForm />);
    await act(async () => {
      wrapper.find('.create-form-button').simulate('click');
      wrapper.find('.confirm-form').simulate('click');
    });
    expect(wrapper.find('#stimDuration-error')).toBeTruthy();
    await act(async () => {
      wrapper.find('.stimduration-field').simulate('change', {
        target: {
          value: '10',
        },
      });
    });
    expect(wrapper.contains('.stimDuration-error')).toEqual(false);
  });

  it('number of trials field updates on change', async () => {
    const wrapper = shallow(<ExperimentForm />);
    await act(async () => {
      wrapper.find('.create-form-button').simulate('click');
      wrapper.find('.confirm-form').simulate('click');
    });
    expect(wrapper.find('#trials-error')).toBeTruthy();
    await act(async () => {
      wrapper.find('.trials-field').simulate('change', {
        target: {
          value: '10',
        },
      });
    });
    expect(wrapper.contains('.trials-error')).toEqual(false);
  });

  //Tests including groups:
  it('groups field generates correctly', async () => {
    const mockResponse = {
      names: ['test1', 'test2'],
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve(new Response(JSON.stringify(mockResponse)));
    });

    const wrapper = shallow(<ExperimentForm />);

    await act(async () => {
      wrapper.find('.create-form-button').simulate('click');
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(wrapper.find('#stimuli-group')).toBeTruthy();
    await act(async () => {
      wrapper.find('.confirm-form').simulate('click');
    });
    expect(wrapper.find('#stimuli-selection-error')).toBeTruthy();
    await act(async () => {
      wrapper
        .find('.stimuli-group')
        .at(1)
        .simulate('change');
    });
    expect(wrapper.contains('.stimuli-selection-error')).toEqual(false);
  });

  it('groups field changes correctly', async () => {
    const mockResponse = {
      names: ['test1', 'test2'],
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve(new Response(JSON.stringify(mockResponse)));
    });

    const wrapper = shallow(<ExperimentForm />);

    await act(async () => {
      wrapper.find('.create-form-button').simulate('click');
    });
    // expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(wrapper.find('#stimuli-group')).toBeTruthy();
    await act(async () => {
      wrapper.find('.confirm-form').simulate('click');
    });
    expect(wrapper.find('#stimuli-selection-error')).toBeTruthy();
    await act(async () => {
      wrapper
        .find('.stimuli-group')
        .at(0)
        .simulate('change');
      wrapper
        .find('.stimuli-group')
        .at(1)
        .simulate('change');
    });
    expect(wrapper.contains('.stimuli-selection-error')).toEqual(false);
  });

  it('outcome tray field changes correctly', async () => {
    const mockResponse = {
      names: ['test1', 'test2'],
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve(new Response(JSON.stringify(mockResponse)));
    });

    const wrapper = shallow(<ExperimentForm />);

    await act(async () => {
      wrapper.find('.create-form-button').simulate('click');
    });
    await act(async () => {
      wrapper
        .find('.stimuli-group')
        .at(0)
        .simulate('change');
      wrapper
        .find('.stimuli-group')
        .at(1)
        .simulate('change');
    });
    await act(async () => {
      wrapper.find('.confirm-form').simulate('click');
    });
    expect(wrapper.find('#stimuli-group')).toBeTruthy();

    await act(async () => {
      wrapper.find('.outcome-tray-1').simulate('click');
      wrapper.find('.outcome-tray-2').simulate('click');
      wrapper.find('.outcome-tray-3').simulate('click');
      wrapper.find('.outcome-none').simulate('click');
    });
    await act(async () => {
      wrapper.find('.outcome-field').simulate('change', {
        target: {
          value: 'Name',
        },
      });
    });
    expect(wrapper.contains('.outcome-error')).toEqual(false);
  });

  it('fixation file selection on change', async () => {
    const wrapper = shallow(<ExperimentForm />);
    await act(async () => {
      wrapper.find('.create-form-button').simulate('click');
      wrapper
        .find('.fixation-point')
        .at(1)
        .simulate('change');
      wrapper.find('.confirm-form').simulate('click');
    });
    expect(wrapper.find('#file-error')).toBeTruthy();
    //Try to change fixation
    await act(async () => {
      wrapper
        .find('.fixation-point')
        .at(0)
        .simulate('change');
      wrapper
        .find('.fixation-point')
        .at(1)
        .simulate('change');
    });
    await act(async () => {
      wrapper.find('.fixation-upload').simulate('change', {
        target: {
          files: [new File([], 'image.jpg')],
        },
      });
    });
    expect(wrapper.contains('.file-error')).toEqual(false);
  });

  it('fixation file selection on click', async () => {
    const wrapper = shallow(<ExperimentForm />);
    await act(async () => {
      wrapper.find('.create-form-button').simulate('click');
      wrapper
        .find('.fixation-point')
        .at(1)
        .simulate('change');
      wrapper.find('.confirm-form').simulate('click');
    });
    expect(wrapper.find('#file-error')).toBeTruthy();
    await act(async () => {
      wrapper.find('.fixation-upload').simulate('click', {
        target: {
          files: [new File([], 'image.jpg')],
        },
      });
    });
    expect(wrapper.contains('.file-error')).toEqual(false);
  });
});
