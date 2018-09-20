/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */
/* global location */
/* eslint no-restricted-globals: 0 */
import styled from 'styled-components'
import { BLACK, BLUE, GRAY, LIGHTGRAY, TURQOISE, WHITE} from 'src/styles/colors.js'
import { MAX_WIDTH } from 'src/styles/layout.js'

import DropDownMenu from 'material-ui/DropDownMenu'
import Button from 'src/components/Button.js'

export const ListenerResetButton = styled(Button)`
  margin-right: 8px;
`

export const NoSelectedSourcePlaceholder = styled.p`
  color: ${GRAY};
  font-size: 12px;
  text-align: center;
`

export const SourceEditingWrapper = styled.div`
  display: flex;
`

export const SourceReachRadiusField = styled.div`
  flex-grow: 1;
`

export const SourceReachFadeDurationField = styled.div`
  width: 30%;
  padding: 0 16px;
`

export const SourceEditingDoneButton = styled(Button)`
  margin-top: 8px;
`
export const Instructions = styled.p`
  color: ${GRAY};
  font-size: 12px;
  margin: 0px 0px;
`

// -------------------------------------------------------------------------- //
export const ContainerDiv = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

export const StyledDropDownMenu = styled(DropDownMenu)`
  height: 56px !important;
  width: 170px !important;
  padding-left: 0px;
  margin: 0px;
`

export const ddmIconStyle = {
  position: `absolute`,
  width: `48px`,
  height: `48px`,
  top: `4px`,
  right: `8px`
}

export const ddmLabelStyle = {
  paddingLeft: `24px`,
  margin: `0px`
}

export const ddmListStyle = {
  paddingLeft: `0px`,
  margin: `0px`,
}

export const ddmMenuItemStyle = {
  padding: `0px`,
}

export const ddmMenuStyle = {
  padding: `0px`,
}

export const ddmSelectedMenuItemStyle = {
  color: `${BLACK}`,
  padding: `0px`
}

export const ddmUnderlineStyle = {
  borderTop: `solid 1px`,
  borderColor : `${LIGHTGRAY}`,
  bottom: `5px`,
  left: `0px`,
  margin: `-1px 16px`,
  position: `relative`,
  width: `auto`,
  right: `0px`,
}

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
  height: `56px`,
  marginRight: `16px`,
  width: `110px`,
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
