import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { values } from 'lodash'

import ArrowButton from 'src/components/ArrowButton'

import { RoomShape } from 'src/constants.js'
import { setListenerPosition } from 'src/actions/listener.actions'
/* ========================================================================== */
const REPEAT_TIME = 50
const METERS_PER_STEP = 0.25
const RADIANS_PER_STEP = Math.PI / 32
/* ========================================================================== */
function calculateNewListenerPosition(
  roomShape,
  roomWidth,
  roomDepth,
  listenerPosition,
  listenerRotation,
  key
) {
  let newX = listenerPosition.x
  let newY = listenerPosition.y
  let rotZAxis = listenerRotation
  let deltaX
  let deltaY

  if (key === 'down') {
    deltaX = -Math.cos(listenerRotation) * METERS_PER_STEP
    deltaY = -Math.sin(listenerRotation) * METERS_PER_STEP
  } else if (key === 'up') {
    deltaX = Math.cos(listenerRotation) * METERS_PER_STEP
    deltaY = Math.sin(listenerRotation) * METERS_PER_STEP
  }

  if (roomShape === RoomShape.RECTANGULAR) {
    if (Math.abs(newX + deltaX) > roomDepth / 2) {
      if (newX >= 0) {
        deltaX = roomDepth / 2 - newX
      } else {
        deltaX = -roomDepth / 2 - newX
      }
      if (Math.abs(deltaY) >= 0.01) {
        deltaY = deltaX * Math.tan(listenerRotation)
      } else {
        deltaY = 0
      }
    }
    if (Math.abs(newY + deltaY) > roomWidth / 2) {
      if (newY >= 0) {
        deltaY = roomWidth / 2 - newY
      } else {
        deltaY = -roomWidth / 2 - newY
      }
      if (Math.abs(deltaX) >= 0.01) {
        deltaX = deltaY * (1 / Math.tan(listenerRotation))
      } else {
        deltaX = 0
      }
    }
  }

  if (key === 'left') {
    rotZAxis = (rotZAxis + RADIANS_PER_STEP) % (2 * Math.PI)
  }
  if (key === 'up') {
    newX += deltaX
    newY += deltaY
  }
  if (key === 'right') {
    rotZAxis = (rotZAxis - RADIANS_PER_STEP) % (2 * Math.PI)
    if (rotZAxis < 0) {
      rotZAxis = 2 * Math.PI + rotZAxis
    }
  }
  if (key === 'down') {
    newX += deltaX
    newY += deltaY
  }

  const radius = roomWidth / 2
  if (roomShape === RoomShape.ROUND && newX ** 2 + newY ** 2 > radius ** 2) {
    const theta = Math.atan(newY / newX) + (newX < 0 ? Math.PI : 0)
    newX = radius * Math.cos(theta)
    newY = radius * Math.sin(theta)
  }

  return { x: newX, y: newY, z: listenerPosition.z, rotZAxis: rotZAxis }
}
/* ========================================================================== */
/* ARROW CONTROLS CONTAINER */
/* ========================================================================== */
class ArrowControlsContainer extends Component {
  state = {
    key: '',
    isMoving: false,
  }

  // onMouseDown = (evt) => {
  //   const { listenerPosition } = this.props
  //
  //   this.state.key = evt
  //   this.state.isMoving = true
  //   this.state.position = listenerPosition
  //
  //   window.addEventListener('mouseup', this.onMouseUp)
  //   this.repeat()
  // }
  //
  // onMouseEnter = (evt) => {
  //   if (this.state.isMoving) {
  //     const { listenerPosition } = this.props
  //
  //     this.state.key = evt
  //     this.state.position = listenerPosition
  //
  //     this.repeat()
  //   }
  // }
  //
  // onMouseUp = () => {
  //   window.removeEventListener('mouseup', this.onMouseUp)
  //   clearTimeout(this.t)
  //   this.state.key = ''
  //   this.state.isMoving = false
  // }
  //
  // onMouseLeave = () => {
  //   clearTimeout(this.t)
  //   this.state.key = ''
  // }

  onTouchStart = evt => {
    this.state.key = evt
    this.state.isMoving = true
    // window.addEventListener('touchmove', this.handleTouchMove, {passive: false}, false)
    window.addEventListener(
      'touchend',
      this.onTouchEnd,
      { passive: false },
      false
    )
    this.repeat()
  }

  onTouchMove = evt => {
    evt.preventDefault()
    evt.stopPropagation()
    this.state.key = evt
    this.state.isMoving = true
    this.repeat()
  }

  onTouchEnd = () => {
    // window.removeEventListener('touchmove', this.onTouchEndMove)
    window.removeEventListener('touchend', this.onTouchEnd)
    clearTimeout(this.t)
    this.state.key = ''
    this.state.isMoving = false
  }

  updatePosition = () => {
    const {
      roomShape,
      roomWidth,
      roomDepth,
      listenerPosition,
      listenerRotation,
    } = this.props
    const key = this.state.key
    const newPos = calculateNewListenerPosition(
      roomShape,
      roomWidth,
      roomDepth,
      listenerPosition,
      listenerRotation,
      key
    )
    this.props.setListenerPosition(newPos)
  }

  repeat = () => {
    this.updatePosition()
    this.t = setTimeout(this.repeat, REPEAT_TIME)
  }
  /* ------------------------------------------------------------------------ */
  render() {
    const arrowControls = (
      <div>
        <div style={{ justifyContent: 'center', textAlign: 'center' }}>
          <ArrowButton
            rotateIcon={-90}
            // onMouseDown={() => this.onMouseDown('up')}
            // onMouseEnter={() => this.onMouseEnter('up')}
            // onMouseLeave={this.onMouseLeave}
            onTouchStart={() => this.onTouchStart('up')}
            onTouchMove={() => {}}
            onTouchEnd={this.onTouchEnd}
          />
        </div>
        <div style={{ justifyContent: 'center', textAlign: 'center' }}>
          <ArrowButton
            rotateIcon={180}
            // onMouseDown={() => this.onMouseDown('left')}
            // onMouseEnter={() => this.onMouseEnter('left')}
            // onMouseLeave={this.onMouseLeave}
            onTouchStart={() => this.onTouchStart('left')}
            onTouchMove={() => {}}
            onTouchEnd={this.onTouchEnd}
          />
          <ArrowButton
            rotateIcon={90}
            // onMouseDown={() => this.onMouseDown('down')}
            // onMouseEnter={() => this.onMouseEnter('down')}
            // onMouseLeave={this.onMouseLeave}
            onTouchStart={() => this.onTouchStart('down')}
            onTouchMove={() => {}}
            onTouchEnd={this.onTouchEnd}
          />
          <ArrowButton
            rotation={0}
            // onMouseDown={() => this.onMouseDown('right')}
            // onMouseEnter={() => this.onMouseEnter('right')}
            // onMouseLeave={this.onMouseLeave}
            onTouchStart={() => this.onTouchStart('right')}
            onTouchMove={() => {}}
            onTouchEnd={this.onTouchEnd}
          />
        </div>
      </div>
    )

    return arrowControls
  }
}

ArrowControlsContainer.propTypes = {
  listenerPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
  }).isRequired,
  listenerRotation: PropTypes.number.isRequired,
  roomWidth: PropTypes.number.isRequired,
  roomDepth: PropTypes.number.isRequired,
  roomShape: PropTypes.oneOf(values(RoomShape)).isRequired,
  setListenerPosition: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  listenerPosition: state.listener.position,
  listenerRotation: state.listener.position.rotZAxis,
  roomWidth: state.room.size.width,
  roomDepth: state.room.size.depth,
  roomShape: state.room.shape,
})

const mapDispatchToProps = dispatch => ({
  setListenerPosition: position => dispatch(setListenerPosition(position)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArrowControlsContainer)
