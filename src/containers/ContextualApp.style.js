/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */
/* global location */
/* eslint no-restricted-globals: 0 */
/* eslint import/prefer-default-export : 0 */
import styled, { createGlobalStyle } from 'styled-components'
import {
  BLACK,
  DARKBLUE,
  LIGHTBLUE,
  GREEN,
  GREY,
  LIGHTGREY,
  ORANGE,
  RED,
  TURQOISE,
  YELLOW,
  WHITE,
  WHITESMOKE,
} from 'src/styles/colors.js'
import { MAX_WIDTH } from 'src/styles/layout'

// ======================= _GLOBAL_ ========================================= //

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:400');

  html, body {
    border: 0;
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    font-size: 10pt;
  }
`
