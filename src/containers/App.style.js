/* eslint no-unused-expressions: 0 */
/* global location */
/* eslint no-restricted-globals: 0 */
import styled, { injectGlobal } from 'styled-components'
import { BLUE, GRAY } from 'src/styles/colors.js'
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

export const Header = styled.div`
  width: 100%;
  max-width: ${MAX_WIDTH}px;
  margin: 0 auto;
  padding-left: 0px;
  padding-right: 32px;
  background: ${BLUE};
`

export const HeaderContent = styled.div`
  padding: 32px 16px 32px;
  width: 100% !important;
  max-width: ${MAX_WIDTH}px;
  margin: 0 auto;
`

export const Heading = styled.h1`
  margin: 0;
  font-size: 24px;
  line-height: 32px;
  display: inline-block;
  color: #fefefe;
`
export const Logo = styled.img`
  max-height: 80px;
  max-width: ${MAX_WIDTH}px;
  margin-top: -24px;
  padding-right: 0px;
  float: right;
`

export const Instructions = styled.p`
  color: ${GRAY};
  font-size: 12px;
  margin: 0px 0px;
`

export const AppContent = styled.div`
  display: flex;
  width: 100%;
  max-width: ${MAX_WIDTH}px;
  margin: 0 auto;
  padding: 24px 16px;
`
