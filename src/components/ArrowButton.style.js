import styled from 'styled-components'
import { BLUE, TURQOISE, WHITE } from 'src/styles/colors.js'

export const StyledArrowButton = styled.button`
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
  touch-action: none;
  -webkit-user-select: none; /* Safari 3.1+ */
  -moz-user-select: none; /* Firefox 2+ */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Standard syntax */

  &:hover {
    background: ${TURQOISE};
  }

  svg {
    width: 32px;
    height: 32px;
    transform: rotate(${props => props.rotateIcon}deg);
    padding: 0px;
  }

  polygon,
  rect {
    fill: ${WHITE};
  }

  ${props =>
    props.isActive
      ? ``
      : ``};
  ${props =>
    props.isEnabled
      ? ``
      : ``};
`
export default StyledArrowButton
