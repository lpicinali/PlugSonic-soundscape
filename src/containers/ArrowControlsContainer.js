/* eslint react/prefer-stateless-function: 0 */
/* eslint react/forbid-prop-types: 0 */
/* eslint prefer-destructuring: 0 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import ArrowButton from 'src/components/ArrowButton'
import { setListenerPosition } from 'src/actions/listener.actions.js'
import { RoomShape } from 'src/constants.js'
// import { H3 } from 'src/styles/elements.js'
import Toggle from 'material-ui/Toggle'
import { toggleStyles } from 'src/containers/ArrowControlsContainer.style'

const repeatTime = 50

function calculateNewListenerPosition(isRound, sizeX, sizeZ, listenerPosition, key) {
  const metresPerStep = (1 - 1.05 ** -Math.max(sizeX, sizeZ)) * 0.75
  const radiansPerStep = Math.min(
    Math.PI / (1.05 ** -Math.max(sizeX, sizeZ) * 48),
    Math.PI / 24
  )

  let newX = Math.cos(listenerPosition.azimuth) * listenerPosition.distance
  let newZ = Math.sin(listenerPosition.azimuth) * listenerPosition.distance
  let rotYAxis = listenerPosition.rotYAxis
  let deltaX
  let deltaZ
  if (key === 'down') {
    deltaX = -Math.sin(listenerPosition.rotYAxis) * metresPerStep
    deltaZ = -Math.cos(listenerPosition.rotYAxis) * metresPerStep
  } else {
    deltaX = Math.sin(listenerPosition.rotYAxis) * metresPerStep
    deltaZ = Math.cos(listenerPosition.rotYAxis) * metresPerStep
  }
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
  if (key === 'left') {
    rotYAxis = (rotYAxis - radiansPerStep) % (2 * Math.PI)
    if (rotYAxis < 0) {
      rotYAxis = 2 * Math.PI + rotYAxis
    }
  }
  if (key === 'up') {
    newX += deltaX
    newZ += deltaZ
  }
  if (key === 'right') {
    rotYAxis = (rotYAxis + radiansPerStep) % (2 * Math.PI)
  }
  if (key === 'down') {
    newX += deltaX
    newZ += deltaZ
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

  return { azimuth, distance, rotYAxis }
}


class ArrowControlsContainer extends Component {
  static propTypes = {
    listenerPosition: PropTypes.object.isRequired,
    isRound: PropTypes.bool.isRequired,
    sizeX: PropTypes.number.isRequired,
    sizeZ: PropTypes.number.isRequired,
    onListenerMove: PropTypes.func.isRequired,
  }

  state = {
    key: '',
    isMoving: false,
    isHidden: true,
    position: { azimuth: 0, distance: 0, rotYAxis: 0 },
  }

  @autobind
  onMouseDown(evt) {

    const { listenerPosition, /* isRound, sizeX, sizeZ, , onListenerMove */ } = this.props

    this.state.key = evt
    this.state.isMoving = true
    this.state.position = listenerPosition

    // const newPos = calculateNewListenerPosition(isRound, sizeX, sizeZ, listenerPosition, evt)
    //
    // this.state.position = newPos
    // onListenerMove(newPos)
    window.addEventListener('mouseup', this.onMouseUp)
    this.repeat()
  }

  @autobind
  onMouseEnter(evt) {
    if (this.state.isMoving) {
      const { listenerPosition, /* isRound, sizeX, sizeZ, onListenerMove, */ } = this.props

      this.state.key = evt
      this.state.position = listenerPosition

      // const newPos = calculateNewListenerPosition(isRound, sizeX, sizeZ, listenerPosition, evt)
      // this.state.position = newPos
      //
      // onListenerMove(newPos)

      this.repeat()
    }
  }

  @autobind
  onMouseUp() {
    window.removeEventListener('mouseup', this.onMouseUp)
    clearTimeout(this.t)
    this.state.key = ''
    this.state.isMoving = false
  }

  @autobind
  onMouseLeave() {
    clearTimeout(this.t)
    this.state.key = ''
  }

  @autobind
  onTouchStart(evt) {
    console.log('touch start')
    // evt.preventDefault()
    // evt.stopPropagation()

    const { listenerPosition, /* isRound, sizeX, sizeZ, , onListenerMove */ } = this.props

    this.state.key = evt
    this.state.isMoving = true
    this.state.position = listenerPosition

    // const newPos = calculateNewListenerPosition(isRound, sizeX, sizeZ, listenerPosition, evt)
    //
    // this.state.position = newPos
    // onListenerMove(newPos)
    // window.addEventListener('touchmove', this.handleTouchMove, {passive: false}, false)
    window.addEventListener('touchend', this.onTouchEnd, {passive: false}, false)
    this.repeat()
  }

  @autobind
  onTouchMove(evt) {
    evt.preventDefault()
    evt.stopPropagation()

    const { listenerPosition, /* isRound, sizeX, sizeZ, , onListenerMove */ } = this.props

    this.state.key = evt
    this.state.isMoving = true
    this.state.position = listenerPosition

    // const newPos = calculateNewListenerPosition(isRound, sizeX, sizeZ, listenerPosition, evt)
    //
    // this.state.position = newPos
    // onListenerMove(newPos)
    this.repeat()
  }

  @autobind
  onTouchEnd() {
    console.log('touch end')
    // window.removeEventListener('touchmove', this.onTouchEndMove)
    window.removeEventListener('touchend', this.onTouchEnd)
    clearTimeout(this.t)
    this.state.key = ''
    this.state.isMoving = false
  }

  @autobind
  onToggle() {
    this.setState({...this.state, isHidden: !this.state.isHidden })
  }

  @autobind
  updatePosition(){
    const { isRound, sizeX, sizeZ, onListenerMove, listenerPosition } = this.props
    const key = this.state.key

    const newPos = calculateNewListenerPosition(isRound, sizeX, sizeZ, listenerPosition, key)
    this.state.position = newPos

    onListenerMove(newPos)
  }

  @autobind
  repeat() {
    console.log('repeat')
    this.updatePosition()
    this.t = setTimeout(this.repeat, repeatTime)
  }

  render() {

    const arrowControls =
      <div>
        <div style={{ justifyContent: 'center', textAlign: 'center' }}>
          <ArrowButton
            rotateIcon={-90}
            onMouseDown={() => this.onMouseDown('up')}
            onMouseEnter={() => this.onMouseEnter('up')}
            onMouseLeave={this.onMouseLeave}
            onTouchStart={() => this.onTouchStart('up')}
            onTouchMove={() => {}}
            onTouchEnd={this.onTouchEnd}
          />
        </div>
        <div style={{ justifyContent: 'center', textAlign: 'center' }}>
          <ArrowButton
            rotateIcon={180}
            onMouseDown={() => this.onMouseDown('left')}
            onMouseEnter={() => this.onMouseEnter('left')}
            onMouseLeave={this.onMouseLeave}
            onTouchStart={() => this.onTouchStart('left')}
            onTouchEnd={this.onTouchEnd}
          />
          <ArrowButton
            rotateIcon={90}
            onMouseDown={() => this.onMouseDown('down')}
            onMouseEnter={() => this.onMouseEnter('down')}
            onMouseLeave={this.onMouseLeave}
            onTouchStart={() => this.onTouchStart('down')}
            onTouchEnd={this.onTouchEnd}

          />
          <ArrowButton
            rotation={0}
            onMouseDown={() => this.onMouseDown('right')}
            onMouseEnter={() => this.onMouseEnter('right')}
            onMouseLeave={this.onMouseLeave}
            onTouchStart={() => this.onTouchStart('right')}
            onTouchEnd={this.onTouchEnd}
          />
        </div>
      </div>

    return (
      // <div style={{ touchAction: 'none' }}>
      <div>
        {/* <div>
          <H3 style={{ marginTop: `50px`}}>azimuth</H3>
          <div>{`${this.props.listenerPosition.azimuth}`}</div>
          <H3 style={{ marginTop: `50px`}}>distance</H3>
          <div>{`${this.props.listenerPosition.distance}`}</div>
          <H3 style={{ marginTop: `50px`}}>rotYAxis</H3>
          <div>{`${this.props.listenerPosition.rotYAxis}`}</div>
        </div> */}

        <Toggle
            label="Touch Arrows"
            style={toggleStyles.toggle}
            labelStyle={toggleStyles.label}
            onToggle={this.onToggle}
        />

        {this.state.isHidden ? <div/> : arrowControls}

      </div>
    )
  }
}

export default connect(
  state => ({
    listenerPosition: state.listener.position,
    isRound: state.room.shape === RoomShape.ROUND,
    sizeX: state.room.size.width/2,
    sizeZ: state.room.size.height/2,
  }),
  dispatch => ({
    onListenerMove: position => dispatch(setListenerPosition(position)),
  })
)(ArrowControlsContainer)
