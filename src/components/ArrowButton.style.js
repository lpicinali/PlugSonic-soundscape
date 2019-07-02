import styled from 'styled-components'
import * as colors from 'src/styles/colors.js'

export const StyledArrowButton = styled.button`
  appearance: none;
  width: 72px !important;
  height: 48px !important;
  margin: 1px;
  padding: 0px 0px;
  background: ${colors.BLACK};
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
    background: ${colors.GREY};
  }

  svg {
    width: 24px;
    height: 24px;
    transform: rotate(${props => props.rotateIcon}deg);
    padding: 0px;
  }

  polygon,
  rect {
    fill: ${colors.WHITE};
  }

  ${props => (props.isActive ? `` : ``)};
  ${props => (props.isEnabled ? `` : ``)};
`
export default StyledArrowButton
