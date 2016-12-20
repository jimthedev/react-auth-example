import React from 'react';
import { storiesOf, action, linkTo, configure, setAddon } from '@kadira/storybook';
import infoAddon from '@kadira/react-storybook-addon-info';
import { withKnobs, text, boolean, number } from '@kadira/storybook-addon-knobs';

setAddon(infoAddon);

import Button from './Button';
import Welcome from './Welcome';
import ProfileCard from '../ProfileCard';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ));
  
var stories = storiesOf('ProfileCard', module)
stories.addDecorator(withKnobs);

  stories.addWithInfo('with picture', 'This image should be max 500px',  () => (
    <ProfileCard picture={text('Picture', 'https://c1.staticflickr.com/1/492/31658643656_9a4cd69975_b.jpg')} name={text('Name', 'Bob Boberson')} />
  ))
  .add('missing picture', () => (
    <ProfileCard name="Anonymous" />
  ))
