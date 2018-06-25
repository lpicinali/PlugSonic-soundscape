/* eslint react/prefer-stateless-function: 0 */
/* eslint react/forbid-prop-types: 0 */
/* eslint no-unused-vars: 0 */
/* eslint no-alert: 0 */
/* eslint prefer-destructuring: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */
import styled from 'styled-components'
import { BLACK, TURQOISE, WHITE } from 'src/styles/colors.js'

const StyledFileInput = styled.button`
  appearance: none;
  padding: 4px 8px;
  margin-right: 8px;
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
`

export default StyledFileInput
