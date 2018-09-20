import styled from 'styled-components'
import { BLACK, TURQOISE, WHITE } from 'src/styles/colors.js'

const StyledButton = styled.button`
  appearance: none;
  padding: 4px 8px;
  background: ${WHITE};
  border: 1px solid ${TURQOISE};
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  color: ${BLACK};
  font-size: 16px;
  transition: all 0.15s;

  &:hover {
    box-shadow: 0 0 0 3px ${TURQOISE};
  }

  ${props =>
    props.isActive
      ? `
    background-color: ${TURQOISE};
    color: ${WHITE};
  `
      : ``} ${props =>
      props.disabled
        ? `
    border-color: gray;
    color: gray;
    pointer-events: none;
  `
        : ``};
`
export default StyledButton
