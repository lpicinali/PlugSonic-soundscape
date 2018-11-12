/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */
/* global location */
/* eslint no-restricted-globals: 0 */
import { PlayButton } from 'react-player-controls'
import styled from 'styled-components'

import { BLACK, BLUE, DARKGRAY, GRAY, LIGHTGRAY, TURQOISE, WHITE, WHITESMOKE } from 'src/styles/colors.js'

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

// -------------------------------------------------------------------------- //

export const toggleStyle = {
  marginTop: `8px`,
  width: `100%`,
}

export const toggleLabelStyle = {
  width: `100%`,
  marginRight: `10%`,
  color: `${DARKGRAY}`,
  fontSize: `12px`,
  fontWeight: `bold`,
  textTransform: `uppercase`,
  letterSpacing: `1px`,
}

// -------------------------------------------------------------------------- //

export const ContainerDiv = styled.div`
  align-items: center;
  background-color: ${WHITE};
  border: 1px solid ${BLUE};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 6px;
  padding: 16px;
  width: 100%;
`
