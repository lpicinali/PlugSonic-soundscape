/* eslint no-unused-vars: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint react/prefer-stateless-function: 0 */
/* eslint no-lonely-if: 0 */
import React, {Component} from 'react'
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'

import * as colors from 'src/styles/colors'

import TabsContainer from 'src/containers/TabsContainer'
// ===================================================================== //
const drawerWidth = 288
const navHeight = 48
// ===================================================================== //
const SoundscapeContainer = styled.div`
  background: ${colors.YELLOW};
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  margin-left: auto;
  margin-right: auto;
`

const Drawer = styled.div`
  background: ${colors.GREEN};
  flex-shrink: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  transition: width 0.5s;
  width: ${props => props.width}px;
`

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`
/* ========================================================================== */
/* SOUNDSCAPE */
/* ========================================================================== */
class Soundscape extends Component {
  render() {
    const { width, height, showSettingsDrawer, roomWidth, roomHeight } = this.props

    const roomRatio = roomWidth/roomHeight
    const newDrawerWidth = showSettingsDrawer ? drawerWidth : 0
    const containerWidth = width - newDrawerWidth
    const containerRatio = containerWidth/height

    let newWidth = 0;
    let newHeight = 0;
    if (roomRatio >= containerRatio) {
      newWidth = containerWidth
      newHeight = (containerWidth * 1/roomRatio) - navHeight
    } else {
      newWidth = height * roomRatio
      newHeight = height - navHeight
    }

    return (
      <Container>
        <SoundscapeContainer width={newWidth} height={newHeight}>
          Soundscape Container
        </SoundscapeContainer>
        <Drawer width={newDrawerWidth}>
          <TabsContainer/>
        </Drawer>
      </Container>
    )
  }
}

Soundscape.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  showSettingsDrawer: PropTypes.bool.isRequired,
  roomWidth: PropTypes.number.isRequired,
  roomHeight: PropTypes.number.isRequired,
}

Soundscape.defaultProps = {
  width: 0,
  height: 0,
  showSettingsDrawer: false,
  roomWidth: 0,
  roomHeight: 0,
}

const mapStateToProps = state => ({
    showSettingsDrawer: state.controls.showSettingsDrawer,
    roomWidth: state.room.size.width,
    roomHeight: state.room.size.height,
})

export default connect(mapStateToProps,null)(Soundscape)
