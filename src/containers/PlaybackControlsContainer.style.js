import { PlayButton, PauseButton } from 'react-player-controls'
import styled from 'styled-components'

import { BLUE, TURQOISE, WHITE } from 'src/styles/colors.js'

const buttonStyles = `
  appearance: none;
  width: 64px !important;
  height: 48px !important;
  display: inline-block;
  margin-top: 10px;
  padding: 0 8px;
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
  }

  polygon,
  rect {
    fill: ${WHITE};
  }
`

export const StyledPlayButton = styled(PlayButton)`
  ${buttonStyles};
`
export const StyledPauseButton = styled(PauseButton)`
  ${buttonStyles};
`
