// @flow
import React from 'react';
import Icon from 'src/components/icon';
import { Select, Container, IconContainer } from './style';

type Props = {
  children: React$Node,
  onChange: (evt: SyntheticInputEvent<HTMLSelectElement>) => void,
  defaultValue?: ?string,
  // React 17: support controlled usage to avoid controlled/uncontrolled warnings
  // Version delta: 16.8.6 -> 17.0.2
  value?: ?string,
};

export default (props: Props) => (
  <Container>
    <Select {...props} />
    <IconContainer>
      <Icon glyph={'down-caret'} size={20} />
    </IconContainer>
  </Container>
);
