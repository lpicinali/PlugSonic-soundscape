/* eslint no-unused-vars: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint react/prefer-stateless-function: 0 */
/* eslint no-lonely-if: 0 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import styled from 'styled-components'
import { clamp, pick } from 'lodash'

import TabsContainer from 'src/containers/TabsContainer'
import * as colors from 'src/styles/colors'

// ===================================================================== //
const drawerWidth = 288
const navHeight = 48

const PIXELS_PER_METER = 10
const SOURCE_SIZE_METERS = 1

const SOUNDSCAPE_CONTAINER_PADDING = 80
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
  background: ${colors.WHITE};
`

const SoundscapeRoom = styled.div`
  position: relative;
  background-image: linear-gradient(
    to bottom right,
    ${colors.LIGHTBLUE},
    ${colors.ORANGE}
  );
`

const Source = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  border-radius: 100%;
  background: black;
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
  state = {
    containerBounds: {
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      x: 0,
      y: 0,
    },
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  $container = null

  handleResize = () => {
    if (this.$container !== null) {
      this.storeContainerRef(this.$container)
    }
  }

  storeContainerRef = $container => {
    this.$container = $container

    const bounds = $container.getBoundingClientRect()
    this.setState({
      containerBounds: {
        width: bounds.width,
        height: bounds.height,
        top: bounds.top,
        right: bounds.right,
        bottom: bounds.bottom,
        left: bounds.left,
        x: bounds.x,
        y: bounds.y,
      },
    })
  }

  render() {
    const {
      width,
      height,
      showSettingsDrawer,
      roomWidth,
      roomDepth,
    } = this.props
    const { containerBounds } = this.state

    const roomRatio = roomWidth / roomDepth

    const viewportWidth =
      roomRatio >= 1 ? containerBounds.width : containerBounds.width * roomRatio
    const viewportHeight =
      roomRatio >= 1
        ? containerBounds.height / roomRatio
        : containerBounds.height

    const viewportScale = viewportWidth / roomWidth
    const relativeScale = viewportScale / PIXELS_PER_METER

    const sourceSize = relativeScale * SOURCE_SIZE_METERS * PIXELS_PER_METER

    return (
      <Container>
        <SoundscapeContainer ref={this.storeContainerRef}>
          <SoundscapeRoom
            style={{
              width: viewportWidth,
              height: viewportHeight,
            }}
          >
            <div>
              Soundscape
              <br />
              Pixels per meter: {PIXELS_PER_METER}
              <br />
              Relative scale: {relativeScale}
              <br />
              Actual pixels per meter: {relativeScale * PIXELS_PER_METER}
            </div>

            <Source
              style={{
                width: sourceSize,
                height: sourceSize,
              }}
            />
          </SoundscapeRoom>
        </SoundscapeContainer>

        <Drawer>
          <TabsContainer />
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

export default connect(
  mapStateToProps,
  null
)(Soundscape)
