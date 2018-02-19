/* global window */
/* eslint react/forbid-prop-types: 0 */
/* eslint react/no-unused-prop-types: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { clamp } from 'lodash'
import { autobind } from 'core-decorators'
import styled from 'styled-components'

import * as CustomPropTypes from 'src/prop-types.js'
import { BLUE, TURQOISE, WHITESMOKE, BLACK } from 'src/styles/colors.js'

const StyledPositionController = styled.div`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: ${WHITESMOKE};
  border: 1px solid ${BLUE};
  border-radius: 100%;
`
// width: ${props => props.size};
// height: ${props => props.size};
const ListenerHandle = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  background: ${BLACK};
  border-radius: 10px;
  text-indent: -9999px;
  overflow: hidden;
  cursor: pointer;
  transform: translate3d(-50%, -50%, 0);
`

const SourceHandle = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  background: ${TURQOISE};
  border-radius: 10px;
  text-indent: -9999px;
  overflow: hidden;
  cursor: pointer;
  transform: translate3d(-50%, -50%, 0);
`

/**
 * Position Controller
 */
class PositionController extends Component {
  static propTypes = {
    bounds: CustomPropTypes.rect.isRequired,
    size: PropTypes.number,
    objects: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        azimuth: PropTypes.number.isRequired,
        distance: PropTypes.number.isRequired,
      })
    ).isRequired,
    listenerPosition: PropTypes.object.isRequired,
    headRadius: PropTypes.number.isRequired,
    onPositionChange: PropTypes.func.isRequired,
    onListenerChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    size: 100,
  }

  state = {
    isDragging: false,
    keys: {},
    // isMoving: false,
    currentObjectId: null,
    position: { azimuth: 0, distance: 0 },
  }

  componentDidMount(){
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp)
  }

  componentWillUnmount(){
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  // @autobind
  // handleClick(){
  //   if (!this.state.isMoving) {
  //     console.log(`MOVING`);
  //     const listener = this.props.listenerPosition;
  //     this.setState(() => ({
  //       ...this.state,
  //       isMoving: true,
  //       currentObjectId: 'listener',
  //       position: { azimuth: listener.azimuth, distance: listener.distance },
  //     }))
  //     console.log(`from POSITION: ${this.state.position.azimuth} , ${this.state.position.distance}`)
  //     window.addEventListener("keydown", this.handleKeyPress);
  //   } else {
  //     console.log('STOPPED');
  //     this.setState(() => ({
  //       ...this.state,
  //       isMoving: false,
  //       currentObjectId: null,
  //     }))
  //     window.removeEventListener("keydown", this.handleKeyPress);
  //   }
  // }

  @autobind
  handleKeyDown(evt) {
    const { size, onListenerChange } = this.props
    const { keys, position } = this.state

    if (evt.keyCode === 37 || evt.keyCode === 38 || evt.keyCode === 39 || evt.keyCode === 40 ){
      evt.preventDefault();
      keys[evt.keyCode] = true;
    }

    // if (isMoving) {
      const speed = 0.5;
      let newX = Math.cos(position.azimuth) * position.distance;
      let newZ = Math.sin(position.azimuth) * position.distance;
      // console.log(`X = ${newX}`);
      // console.log(`Z = ${newZ}`);
      if (keys && keys[37]) {
        // console.log('LEFT');
        newX -= speed;
      }
      if (keys && keys[38] ) {
        // console.log('UP');
        newZ += speed;
      }
      if (keys && keys[39] ) {
        // console.log('RIGHT');
        newX += speed;
      }
      if (keys && keys[40] ) {
        // console.log('DOWN');
        newZ -= speed;
      }
      // console.log(`newX = ${newX}`);
      // console.log(`newZ = ${newZ}`);
      const azimuth = Math.atan(newZ / newX) + (newX < 0 ? Math.PI : 0)
      let distance = Math.sqrt(newX ** 2 + newZ ** 2)
      distance = Math.max(0.3, distance)
      distance = Math.min(distance, size)
      // console.log(`NEW AZIMUTH -> ${azimuth}`);
      // console.log(`NEW DISTANCE -> ${distance}`);
      const newPos = { azimuth, distance }

      this.setState({
        ...this.state,
        position: newPos,
      })

      onListenerChange(newPos);
    // }
  }

  @autobind
  handleKeyUp(evt) {
    const { keys } = this.state;

    if (evt.keyCode === 37 || evt.keyCode === 38 || evt.keyCode === 39 || evt.keyCode === 40 ){
      keys[evt.keyCode] = false;
    }
  }

  @autobind
  handlePress(objectId) {
    let object;
    if (objectId === 'listener'){
      object = this.props.listenerPosition;
    } else {
      object = this.props.objects.find(x => x.id === objectId);
    }

    this.setState(() => ({
      isDragging: true,
      currentObjectId: objectId,
      position: { azimuth: object.azimuth, distance: object.distance },
    }))

    window.addEventListener('mousemove', this.handleDrag)
    window.addEventListener('mouseup', this.handleRelease)
  }

  @autobind
  handleDrag(evt) {
    const { bounds, size, onPositionChange, onListenerChange } = this.props
    const { isDragging, currentObjectId } = this.state

    if (isDragging) {
      const rect = bounds
      // clamp(number,[lowerBound],upperBound)
      const constrainedMouseX = clamp(
        evt.pageX,
        window.scrollX + rect.left,
        window.scrollX + rect.left + rect.width
      )
      const constrainedMouseY = clamp(
        evt.pageY,
        window.scrollY + rect.top,
        window.scrollY + rect.top + rect.height
      )

      const newX =
        (constrainedMouseX - (window.scrollX + rect.left + rect.width / 2)) /
        (rect.width / 2)
      const newZ =
        (constrainedMouseY - (window.scrollY + rect.top + rect.height / 2)) /
        (rect.height / 2)

      const azimuth = Math.atan(-newZ / newX) + (newX < 0 ? Math.PI : 0)
      let distance = size * Math.sqrt(newX ** 2 + newZ ** 2)
      distance = Math.max(0.3, distance)
      distance = Math.min(distance, size)

      const newPos = { azimuth, distance }

      this.setState({
        ...this.state,
        position: newPos,
      })

      if (currentObjectId === 'listener') {
        onListenerChange(newPos);
      } else {
        onPositionChange(currentObjectId, newPos)
      }
    }
  }

  @autobind
  handleRelease() {
    window.removeEventListener('mousemove', this.handleDrag)
    window.removeEventListener('mouseup', this.handleRelease)

    this.setState(() => ({
      ...this.state,
      isDragging: false,
      currentObjectId: null,
    }))
  }

  render() {
    const { bounds, size, objects, listenerPosition, headRadius } = this.props

    // console.log('PositionController.render()', bounds.top)

    return (
      <StyledPositionController
        width={bounds.width}
        height={bounds.height}
      >
          <ListenerHandle
            key='listener'
            style={{
              top: `${50 -
                50 * (Math.sin(listenerPosition.azimuth) * listenerPosition.distance / size)}%`,
              left: `${50 +
                50 * (Math.cos(listenerPosition.azimuth) * listenerPosition.distance / size)}%`,
            }}
            size={`calc(${100 * (headRadius / 0.5) * (size / 12) / size}% + 8px)`}
            onMouseDown={() => this.handlePress('listener')}
          >
            <span>listener</span>
          </ListenerHandle>

        {objects.map(object => (
          <SourceHandle
            key={object.id}
            style={{
              top: `${50 -
                50 * (Math.sin(object.azimuth) * object.distance / size)}%`,
              left: `${50 +
                50 * (Math.cos(object.azimuth) * object.distance / size)}%`,
            }}
            onMouseDown={() => this.handlePress(object.id)}
          >
            <span>{object.label}</span>
          </SourceHandle>
        ))}
      </StyledPositionController>
    )
  }
}

export default PositionController
