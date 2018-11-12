/* eslint no-unused-vars: 0 */
import styled from 'styled-components'
import ReactDropzone from 'react-dropzone'
import Icon from "material-ui/svg-icons/av/library-music"
import { BLACK, BLUE, GRAY, LIGHTGRAY, TURQOISE, WHITE } from 'src/styles/colors'

// -------------------------------------------------------------------------- //

export const Dropzone = styled(ReactDropzone)`
  background-color: ${WHITE};
  border: dashed thin #666;
  border-radius: 5px;
  color: ${GRAY};
  font-size: 12px;
  text-align: center;
  width: 100%;
`

export const ActionIcon = styled(Icon)`
  color: ${GRAY} !important;
  height: 40px !important;
  margin: 10px 0px 4px 0px;
  width: 40px !important;
`

// -------------------------------------------------------------------------- //

export const ContainerDiv = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-top: 16px;
  width: 100%;
`

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
