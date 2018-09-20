/* eslint import/prefer-default-export:0 */
/* eslint no-unused-vars: 0 */
import styled from 'styled-components'
import { BLACK, BLUE, GRAY, LIGHTGRAY, TURQOISE, WHITE } from 'src/styles/colors'

// -------------------------------------------------------------------------- //

export const tfFloatingLabelFocusStyle = {
  color: `#00bcd4`,
  lineHeight: `24px`,
  position: `absolute`,
  top: `18px`,
  transform: `scale(0.75) translate(0, -28px)`,
  transformOrigin: `left top`,
  transition: `all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms`,
}

export const tfFloatingLabelStyle = {
  color: `${LIGHTGRAY}`,
  lineHeight: `24px`,
  position: `absolute`,
  top: `18px`,
  transform: `scale(0.75) translate(0, -28px)`,
  transformOrigin: `left top`,
  transition: `all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms`,
}

export const tfStyle = {
  backgroundColor: `${WHITE}`,
  height: `56px`,
  marginRight: `16px`,
  marginTop: `0px`,
  width: `50%`,
}

export const tfInputStyle = {
  marginTop: `0px`,
}

export const tfUnderlineFocusStyle = {
  borderBottomStyle: `solid`,
  borderBottomWidth: `2px`,
  borderColor: `#00bcd4`,
  bottom: `5px`,
  margin: `0px`,
  position: `absolute`,
  transform: `scaleX(0)`,
  transition: `all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms`,
  width: `100%`
}

export const tfUnderlineStyle = {
  borderBottomStyle: `solid`,
  borderBottomWidth: `1px`,
  borderColor: `${LIGHTGRAY}`,
  bottom: `5px`,
  margin: `0px`,
  position: `absolute`,
  width: "100%"
}
