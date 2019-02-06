/* eslint no-unused-vars: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint react/prefer-stateless-function: 0 */
/* eslint no-lonely-if: 0 */
import React, {Component} from 'react'
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import styled from 'styled-components'
import { clamp, pick } from 'lodash'

import TabsContainer from 'src/containers/TabsContainer'
import * as colors from 'src/styles/colors'

// ===================================================================== //
const drawerWidth = 288
const navHeight = 48

const MAP_SCALE = 10
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

const SoundscapeViewport = styled.div`
  position: relative;
  overflow: hidden;
  border: 1px solid ${colors.BLACK};
`

const SoundscapeDraggableBounds = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
`

const SoundscapeRoom = styled.div`
  position: absolute;
  background-image: linear-gradient(to bottom right, ${colors.LIGHTBLUE}, ${colors.ORANGE});
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

  storeContainerRef = ($container) => {
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
      }
    })
  }

  render() {
    const { width, height, showSettingsDrawer, roomWidth, roomDepth } = this.props
    const { containerBounds } = this.state

    const mapWidth = roomWidth * MAP_SCALE
    const mapHeight = roomDepth * MAP_SCALE

    const viewportWidth = Math.max(0, Math.min(containerBounds.width - 80, mapWidth))
    const viewportHeight = Math.max(0, Math.min(containerBounds.height - 80, mapHeight))

    const diffWidth = viewportWidth - mapWidth
    const diffHeight = viewportHeight - mapHeight
    const draggableAreaBleedWidth = Math.max(0, -diffWidth) * 2
    const draggableAreaBleedHeight = Math.max(0, -diffHeight) * 2

    return (
      <Container>
        <SoundscapeContainer ref={this.storeContainerRef}>
          <SoundscapeViewport
            style={{
              width: viewportWidth,
              height: viewportHeight,
            }}
          >
            <SoundscapeDraggableBounds
              style={{
                width: `calc(100% + ${draggableAreaBleedWidth}px)`,
                height: `calc(100% + ${draggableAreaBleedHeight}px)`,
              }}
            >
              <Draggable
                bounds="parent"
              >
                <SoundscapeRoom
                  style={{
                    width: mapWidth,
                    height: mapHeight,
                  }}
                >
                  Soundscape
                </SoundscapeRoom>
              </Draggable>
            </SoundscapeDraggableBounds>
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
