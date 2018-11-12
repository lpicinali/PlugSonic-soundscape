/* eslint react/prefer-stateless-function: 0 */
/* eslint react/forbid-prop-types: 0 */
/* eslint no-unused-vars: 0 */
/* eslint no-alert: 0 */
/* eslint prefer-destructuring: 0 */
import styled, { injectGlobal } from 'styled-components'
import { BLACK, BLUE, DARKGRAY, GRAY, LIGHTGRAY, TURQOISE, WHITE, WHITESMOKE } from 'src/styles/colors.js'
import { MAX_WIDTH } from 'src/styles/layout.js'

export const StyledFileInput = styled.button`
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

export const ImportExportButtonDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`

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
