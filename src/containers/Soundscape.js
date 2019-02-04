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

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

const SoundscapeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  background: ${colors.YELLOW};
`

const SoundscapeViewport = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid black;
`

const SoundscapeRoom = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${props => props.roomWidth * 10}px;
  height: ${props => props.roomDepth * 10}px;
  transform: translate3d(-50%, -50%, 0);
  background: yellow;
`

const Drawer = styled.div`
  background: ${colors.GREEN};
  overflow-x: hidden;
  overflow-y: scroll;
  transition: width 0.5s;
  width: ${drawerWidth}px;
`

/* ========================================================================== */
/* SOUNDSCAPE */
/* ========================================================================== */
class Soundscape extends Component {
  render() {
    const { width, height, showSettingsDrawer, roomWidth, roomDepth } = this.props

    // const roomRatio = roomWidth/roomDepth
    // const newDrawerWidth = showSettingsDrawer ? drawerWidth : 0
    // const containerWidth = width - newDrawerWidth
    // const containerRatio = containerWidth/height

    // let newWidth = 0;
    // let newHeight = 0;
    // if (roomRatio >= containerRatio) {
    //   newWidth = containerWidth
    //   newHeight = (containerWidth * 1/roomRatio) - navHeight
    // } else {
    //   newWidth = height * roomRatio
    //   newHeight = height - navHeight
    // }

    return (
      <Container>
        <SoundscapeContainer>
          <SoundscapeViewport>
            <SoundscapeRoom roomWidth={roomWidth} roomDepth={roomDepth}>
              Soundscape
            </SoundscapeRoom>
          </SoundscapeViewport>
        </SoundscapeContainer>

        <Drawer>
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
}

Soundscape.defaultProps = {
  width: 0,
  height: 0,
  showSettingsDrawer: false,
  roomWidth: 0,
  roomDepth: 0,
}

const mapStateToProps = state => ({
    showSettingsDrawer: state.controls.showSettingsDrawer,
    roomWidth: state.room.size.width,
    roomDepth: state.room.size.depth,
})

export default connect(mapStateToProps,null)(Soundscape)
