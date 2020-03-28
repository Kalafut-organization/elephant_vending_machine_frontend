import React from 'react';
import { shallow } from 'enzyme';
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

  it('renders a view button', () => {
    const wrapper = shallow(
      <StimuliCard url="http://localhost/static/img/some_image_url.jpg" />
    );
    const button = wrapper.find('Button');
    expect(button).toHaveLength(1);
    expect(button.text()).toEqual('View');
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
});
