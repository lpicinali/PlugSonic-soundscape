/* eslint react/prefer-stateless-function: 0 */
/* eslint react/forbid-prop-types: 0 */
/* eslint prefer-destructuring: 0 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
// import { values } from 'lodash'
// import { PlaybackState } from 'src/constants.js'
// import { setPlaybackState } from 'src/actions/controls.actions.js'
import { StyledArrowButton } from 'src/containers/ArrowControlsContainer.style'
import { setListenerPosition } from 'src/actions/listener.actions.js'
import { RoomShape } from 'src/constants.js'

import { H3 } from 'src/styles/elements.js'

/**
 * Playback Controls Container
 */
class ArrowControlsContainer extends Component {
  static propTypes = {
    listenerPosition: PropTypes.object.isRequired,
    roomSize: PropTypes.object.isRequired,
    isRound: PropTypes.bool.isRequired,
    onListenerMove: PropTypes.func.isRequired,
  }

  state = {
    isMoving: false,
    // keys: {},
    // currentObjectId: null,
    position: { azimuth: 0, distance: 0, rotYAxis: 0 },
  }

  @autobind
  handleMouseDown(arrow) {
    const {  onListenerMove, listenerPosition, roomSize, isRound } = this.props
    const sizeX = roomSize.width/2
    const sizeZ = roomSize.height/2

    console.log(`handleMouseDown: ${arrow}` )

    // arrow.preventDefault()
    // const { keys } = this.state
    // keys[e.keyCode] = true

    this.setState(() => ({
      ...this.state,
      isMoving: true,
      // currentObjectId: 'listener',
      // keys,
      position: {
        azimuth: listenerPosition.azimuth,
        distance: listenerPosition.distance,
        rotYAxis: listenerPosition.rotYAxis,
      },
    }))

    const metresPerStep = (1 - 1.05 ** -Math.max(sizeX, sizeZ)) * 0.75
    const radiansPerStep = Math.min(
        Math.PI / (1.05 ** -Math.max(sizeX, sizeZ) * 48),
        Math.PI / 24
      )

    let newX = Math.cos(listenerPosition.azimuth) * listenerPosition.distance
    let newZ = Math.sin(listenerPosition.azimuth) * listenerPosition.distance
    let rotYAxis = listenerPosition.rotYAxis
    let deltaX = Math.sin(listenerPosition.rotYAxis) * metresPerStep
    let deltaZ = Math.cos(listenerPosition.rotYAxis) * metresPerStep

    if (!isRound) {
      if (Math.abs(newX + deltaX) > sizeX) {
        if (newX >= 0) {
          deltaX = sizeX - newX
        } else {
          deltaX = -sizeX - newX
        }
        if (Math.abs(deltaZ) >= 0.01) {
          deltaZ = deltaX * Math.tan(rotYAxis)
        } else {
          deltaZ = 0
        }
      }
      if (Math.abs(newZ + deltaZ) > sizeZ) {
        if (newZ >= 0) {
          deltaZ = sizeZ - newZ
        } else {
          deltaZ = -sizeZ - newZ
        }
        if (Math.abs(deltaX) >= 0.01) {
          deltaX = deltaZ * (1 / Math.tan(rotYAxis))
        } else {
          deltaX = 0
        }
      }
    }

    if (arrow === 'left') {
      rotYAxis = (rotYAxis - radiansPerStep) % (2 * Math.PI)
      if (rotYAxis < 0) {
        rotYAxis = 2 * Math.PI + rotYAxis
      }
    }
    if (arrow === 'up') {
      newX += deltaX
      newZ += deltaZ
    }
    if (arrow === 'right') {
      rotYAxis = (rotYAxis + radiansPerStep) % (2 * Math.PI)
    }
    if (arrow === 'down') {
      newX -= deltaX
      newZ -= deltaZ
    }

    let azimuth
    if (newX === 0 && newZ === 0) {
      azimuth = listenerPosition.azimuth
    } else {
      azimuth = Math.atan(newZ / newX) + (newX < 0 ? Math.PI : 0)
    }
    let distance = Math.sqrt(newX ** 2 + newZ ** 2)

    if (isRound) {
      distance = Math.min(distance, sizeX)
    }

    const newPos = { azimuth, distance, rotYAxis }

    this.setState({
      ...this.state,
      position: newPos,
    })

    onListenerMove(newPos)
  }

  @autobind
  handleMouseUp() {
    // const { keys } = this.state
    // keys[arrow.keyCode] = false
    // if (!keys[37] && !keys[38] && !keys[39] && !keys[40]) {
    this.setState(() => ({
      ...this.state,
      isMoving: false,
      // currentObjectId: null,
      // keys: {},
    }))
      // } else {
      //   this.setState(() => ({
      //     ...this.state,
      //     keys,
      //   }))
      // }
  }

  render() {
    // const { playbackState, onStateChange } = this.props

    return (
      <div>
        <H3 style={{ marginTop: `50px`}}>Arrow Controls</H3>

        <div style={{ justifyContent: 'center', textAlign: 'center' }}>
          <StyledArrowButton
            isEnabled
            onMouseDown={() => this.handleMouseDown('up')}
            onClick={() => this.handleMouseDown('up')}
            rotation={-90}
          />
        </div>
        <div style={{ justifyContent: 'center', textAlign: 'center' }}>
          <StyledArrowButton
              isEnabled
              rotation={180}
              onClick={() => this.handleMouseDown('left')}
          />
          <StyledArrowButton
              isEnabled
              rotation={90}
              onClick={() => this.handleMouseDown('down')}
          />
          <StyledArrowButton
              isEnabled
              rotation={0}
              onClick={() => this.handleMouseDown('right')}
          />
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    listenerPosition: state.listener.position,
    roomSize: state.room.size,
    isRound: state.room.roomShape === RoomShape.ROUND
  }),
  dispatch => ({
    onListenerMove: position => dispatch(setListenerPosition(position)),
  })
)(ArrowControlsContainer)
