/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */
/* global location */
/* eslint no-restricted-globals: 0 */
import styled, { injectGlobal } from 'styled-components'
import { BLACK, BLUE, GRAY, LIGHTGRAY, TURQOISE, WHITE, WHITESMOKE } from 'src/styles/colors.js'
import { MAX_WIDTH } from 'src/styles/layout.js'

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,700');

  html, body {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Roboto', sans-serif;
  }
`

// -------------------------------------------------------------------------- //

export const AppContent = styled.div`
  display: flex;
  width: 100%;
  max-width: ${MAX_WIDTH}px;
  margin: 0 auto;
  padding: 6px 0px 6px 0px;
`

// -------------------------------------------------------------------------- //

export const EmptyColumn = styled.div`
  width: 0.5%;
`

export const FirstColumn = styled.div`
  align-items: center;
  border: 1px solid ${BLUE};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 24.5%;
`

export const SecondColumn = styled.div`
  align-items: center;
  border: 1px solid ${BLUE};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 50%;
`

export const ThirdColumn = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  ${'' /* Same as ListenerOptionsContainer padding+border */}
  padding: 0px 17px 0px 17px;
  width: 24.5%;
`

// -------------------------------------------------------------------------- //

export const Header = styled.div`
  align-items: center;
  background: ${BLUE};
  display: flex;
  height: 96px;
  justify-content: space-between;
  margin: auto;
  max-width: ${MAX_WIDTH}px;
  width: 100%;
`

export const Heading = styled.h1`
  color: #fefefe;
  font-size: 24px;
  line-height: 32px;
  padding-left: 16px;
`
export const Logo = styled.img`
  height: 60px;
  padding-right: 12px;
`

// -------------------------------------------------------------------------- //

export const Instructions = styled.p`
  color: ${GRAY};
  font-size: 12px;
  margin: 0px 0px;
`

// -------------------------------------------------------------------------- //
