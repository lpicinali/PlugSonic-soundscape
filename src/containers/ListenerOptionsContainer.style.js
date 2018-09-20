/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */
/* global location */
/* eslint no-restricted-globals: 0 */
import styled, { injectGlobal } from 'styled-components'
import { BLACK, BLUE, DARKGRAY, GRAY, LIGHTGRAY, TURQOISE, WHITE, WHITESMOKE } from 'src/styles/colors.js'
import { MAX_WIDTH } from 'src/styles/layout.js'


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

export const HeadCircContainerDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 16px;
  width: 100%;
`
