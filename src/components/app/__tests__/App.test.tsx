import React from 'react';
import { mount, shallow, ReactWrapper } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../home/Home';
import App from '../App';

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const waitForComponent: any = async (
  page: ReactWrapper,
  component: React.FC,
  i = 0
) => {
  if (i > 9) {
    console.log(page.debug());
    throw new Error('Component not found');
  }

  if (i === 0 && page.find(component).length) {
    return Promise.resolve();
  }

  await timeout(10);
  page.update();

  if (page.find(component).length) {
    return Promise.resolve();
  }
  return waitForComponent(page, component, i + 1);
};

describe('<App />', () => {
  it('renders without crashing', () => {
    shallow(<App />);
  });

  it('renders navbar with title', () => {
    const wrapper = shallow(<App />);
    const navbar = wrapper.find('NavbarBrand');
    expect(navbar).toHaveLength(1);
    expect(navbar.text()).toEqual('Elephant Vending Machine');
  });

  it('lazy loads home component', async () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(
      wrapper
        .find('Col')
        .find('div')
        .at(0)
        .text()
    ).toEqual('Loading...');
    await waitForComponent(wrapper, 'Home');
    expect(wrapper.contains(Home)).toEqual(true);
    expect(wrapper.first().find('Button')).toHaveLength(4);
    wrapper.unmount();
  });
});
