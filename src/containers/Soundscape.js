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
  background-image: url(${props => props.image});
  background-size: cover;
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
    const { width, height, showSettingsDrawer, roomWidth, roomDepth } = this.props

    const roomRatio = roomWidth/roomDepth
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
        <SoundscapeContainer width={newWidth} height={newHeight} image={this.props.roomImage}>
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
  roomDepth: PropTypes.number.isRequired,
  roomImage: PropTypes.string
}

Soundscape.defaultProps = {
  width: 0,
  height: 0,
  showSettingsDrawer: false,
  roomWidth: 0,
  roomDepth: 0,
  roomImage: '',
}

const mapStateToProps = state => ({
    showSettingsDrawer: state.controls.showSettingsDrawer,
    roomWidth: state.room.size.width,
    roomDepth: state.room.size.depth,
    roomImage: state.room.image.raw,
})

export default connect(mapStateToProps,null)(Soundscape)
