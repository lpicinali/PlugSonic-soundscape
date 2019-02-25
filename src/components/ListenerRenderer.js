import React, { Component} from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import * as colors from 'src/styles/colors'
import styled from 'styled-components'
import { clamp, values } from 'lodash'

import { RoomShape } from 'src/constants.js'
import { setListenerPosition } from 'src/actions/listener.actions'
/* ========================================================================== */
const METERS_PER_STEP = 0.25
const RADIANS_PER_STEP = Math.PI/32
/* ========================================================================== */
const Listener = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0) rotate(${props => -props.rotation}rad);
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: ${colors.DARKBLUE};
  background: ${colors.LIGHTBLUE};
`
/* ========================================================================== */
/* LISTENER RENDERER */
/* ========================================================================== */
class ListenerRenderer extends Component {

  state = {
    isDragging: false,
    keys: {},
  }

  /* ------------------------------------------------------------------------ */
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keyup', this.handleKeyUp)
  }

  handleKeyDown = (e) => {
    // 37 = LEFT | 38 = UP | 39 = RIGHT | 40 = DOWN
    if ( e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 ) {
      e.preventDefault()
      if (!this.state.isDragging) {
        const { roomShape, roomWidth, roomDepth, listenerPosition, listenerRotation } = this.props
        const { keys } = this.state

        keys[e.keyCode] = true

        this.setState({
          ...this.state,
          keys,
        })

        let newX = listenerPosition.x
        let newY = listenerPosition.y
        let rotZAxis = listenerRotation
        let deltaX
        let deltaY

        if (e.keyCode === 40 || keys[40]) {
          deltaX = -Math.cos(listenerRotation) * METERS_PER_STEP
          deltaY = -Math.sin(listenerRotation) * METERS_PER_STEP
        } else if (e.keyCode === 38 || keys[38]) {
          deltaX = Math.cos(listenerRotation) * METERS_PER_STEP
          deltaY = Math.sin(listenerRotation) * METERS_PER_STEP
        }

        if (roomShape === RoomShape.RECTANGULAR) {
          if (Math.abs(newX + deltaX) > roomDepth/2) {
            if (newX >= 0) {
              deltaX = roomDepth/2 - newX
            } else {
              deltaX = -roomDepth/2 - newX
            }
            if (Math.abs(deltaY) >= 0.01) {
              deltaY = deltaX * Math.tan(listenerRotation)
            } else {
              deltaY = 0
            }
          }
          if (Math.abs(newY + deltaY) > roomWidth/2) {
            if (newY >= 0) {
              deltaY = roomWidth/2 - newY
            } else {
              deltaY = -roomWidth/2 - newY
            }
            if (Math.abs(deltaX) >= 0.01) {
              deltaX = deltaY * (1 / Math.tan(listenerRotation))
            } else {
              deltaX = 0
            }
          }
        }

        if (keys && keys[37]) {
          rotZAxis = (rotZAxis + RADIANS_PER_STEP) % (2 * Math.PI)
        }
        if (keys && keys[38]) {
          newX += deltaX
          newY += deltaY
        }
        if (keys && keys[39]) {
          rotZAxis = (rotZAxis - RADIANS_PER_STEP) % (2 * Math.PI)
          if (rotZAxis < 0) {
            rotZAxis = 2 * Math.PI + rotZAxis
          }
        }
        if (keys && keys[40]) {
          newX += deltaX
          newY += deltaY
        }

        const radius = roomWidth / 2
        if (roomShape === RoomShape.ROUND && newX**2 + newY**2 > radius**2) {
          const theta = Math.atan(newY / newX) + (newX < 0 ? Math.PI : 0)
          newX = radius * Math.cos(theta)
          newY = radius * Math.sin(theta)
        }

        this.props.setListenerPosition({
          x: newX,
          y: newY,
          z: listenerPosition.z,
          rotZAxis: rotZAxis
        })
      }
    }
  }

  handleKeyUp = (e) => {
    if ( e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 ) {
      e.preventDefault()
      const { keys } = this.state
      keys[e.keyCode] = false
      if (!keys[37] && !keys[38] && !keys[39] && !keys[40]) {
        this.setState({
          ...this.state,
          keys: {},
        })
      } else {
        this.setState({
          ...this.state,
          keys,
        })
      }
    }
  }

  /* ------------------------------------------------------------------------ */
  handleListenerMouseDown = () => {
    this.setState({
      isDragging: true,
    })
    document.addEventListener('mousemove', this.handleListenerMouseDrag)
    document.addEventListener('mouseup', this.handleListenerMouseUp)
  }

  handleListenerMouseDrag = (e) => {
    const { roomShape, roomWidth, roomDepth, containerSize, containerRect } = this.props
    const { isDragging } = this.state

    if (isDragging) {
      // in web coordinate system
      const constrainedMouseX = clamp(
        e.pageX,
        containerRect.left,
        containerRect.right
      )
      const constrainedMouseY = clamp(
        e.pageY,
        containerRect.top,
        containerRect.bottom
      )
      // in room coordinate system
      let newX =
        -1 * (constrainedMouseY - (containerRect.top + containerSize.height / 2)) /
        (containerSize.height / 2)
      let newY =
        -1 * (constrainedMouseX - (containerRect.left + containerSize.width / 2)) /
        (containerSize.width / 2)

      if (roomShape === RoomShape.ROUND && newX**2 + newY**2 > 1) {
        const theta = Math.atan(newY / newX) + (newX < 0 ? Math.PI : 0)
        const radius = roomWidth / 2
        newX = radius * Math.cos(theta)
        newY = radius * Math.sin(theta)
      } else {
        newX *= roomDepth / 2
        newY *= roomWidth / 2
      }

      this.props.setListenerPosition({
        x: newX,
        y: newY,
        z: this.props.listenerPosition.z,
        rotZAxis: this.props.listenerRotation
      })
    }
  }

  handleListenerMouseUp = () => {
    window.removeEventListener('mousemove', this.handleListenerMouseDrag)
    window.removeEventListener('mouseup', this.handleListenerMouseUp)

    this.setState(() => ({
      ...this.state,
      isDragging: false,
    }))
  }

  /* ------------------------------------------------------------------------ */
  render() {
    // console.log(this.state.keys)
    return (
      <Listener
        key='listener'
        rotation={this.props.listenerRotation}
        style={{
          width: this.props.iconWidth,
          height: this.props.iconHeight,
          top: `${50 + (100 * -1 * this.props.listenerPosition.x) / this.props.roomDepth}%`,
          left: `${50 + (100 * -1 * this.props.listenerPosition.y) / this.props.roomWidth}%`,
        }}
        onMouseDown={this.handleListenerMouseDown}
      />
    )
  }
}

ListenerRenderer.propTypes = {
  listenerPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
  }).isRequired,
  listenerRotation: PropTypes.number.isRequired,
  iconWidth: PropTypes.number.isRequired,
  iconHeight: PropTypes.number.isRequired,
  roomWidth: PropTypes.number.isRequired,
  roomDepth: PropTypes.number.isRequired,
  roomShape: PropTypes.oneOf(values(RoomShape)).isRequired,
  containerSize: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  containerRect: PropTypes.shape({
    top: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
  }).isRequired,
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

export default connect(mapStateToProps,mapDispatchToProps)(ListenerRenderer)
