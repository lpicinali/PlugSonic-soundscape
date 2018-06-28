/* eslint import/prefer-default-export:0 */
import { PlayButton } from 'react-player-controls'
import styled from 'styled-components'

import { BLUE, TURQOISE, WHITE } from 'src/styles/colors.js'

export const StyledArrowButton = styled(PlayButton)`
  appearance: none;
  width: 80px !important;
  height: 60px !important;
  margin: 5px;
  padding: 0px 0px;
  background: ${BLUE};
  border: none;
  border-radius: 5px;
  outline: none;
  cursor: pointer;

  &:hover {
    background: ${TURQOISE};
  }

  svg {
    width: 32px;
    height: 32px;
    transform: rotate(${props => props.rotation}deg);
    padding: 0px;
  }

  polygon,
  rect {
    fill: ${WHITE};
  }
`
