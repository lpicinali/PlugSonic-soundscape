/* global window */
/* eslint react/forbid-prop-types: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint prefer-destructuring: 0 */

/* ------------------- NOTES -------------------- *//*

TO DO:
  - minimum distance between sources and/or listener:
    - circle constraint
  - listener keyboard movement bug:
    - listener stops when changing from 2 to 1 keys pressed
  - allow only for rotation when dragging listener with mouse

*//* ---------------------------------------------- */

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
// transform: rotate(${props => props.listenerPosition.azimuth} rad)
  // transform: translate3d(-8px, -10px, 0);

const ListenerHandle = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 8px 20px 8px;
  border-color: transparent transparent ${BLACK} transparent;
  position: absolute;
  text-indent: -9999px;
  overflow: hidden;
  cursor: pointer;
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
  transform: translate3d(-50%, -50%, 0)
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
    isMoving: false,
    keys: {},
    currentObjectId: null,
    position: { azimuth: 0, distance: 0, rotYAxis: 0 },
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
    if (evt.keyCode === 37 || evt.keyCode === 38 || evt.keyCode === 39 || evt.keyCode === 40 ){
      evt.preventDefault();

      const { size, onListenerChange, listenerPosition } = this.props
      const { keys } = this.state
      keys[evt.keyCode] = true;

      this.setState(() => ({
        ...this.state,
        isMoving: true,
        currentObjectId: 'listener',
        keys,
        position: {
          azimuth: listenerPosition.azimuth,
          distance: listenerPosition.distance,
          rotYAxis: listenerPosition.rotYAxis
        },
      }))

      const metresPerStep = 1;
      const radiansPerStep = Math.PI/24;

      let newX = Math.cos(listenerPosition.azimuth) * listenerPosition.distance;
      let newZ = Math.sin(listenerPosition.azimuth) * listenerPosition.distance;
      let rotYAxis = listenerPosition.rotYAxis;
      const deltaX = Math.sin(listenerPosition.rotYAxis) * metresPerStep;
      const deltaZ = Math.cos(listenerPosition.rotYAxis) * metresPerStep;
      if (keys && keys[37]) {
        // console.log('LEFT');
        // newX -= metresPerStep;
        rotYAxis = (rotYAxis - radiansPerStep) % (2*Math.PI);
      }
      if (keys && keys[38] ) {
        // console.log('UP');
        // newZ += metresPerStep;
        newX += deltaX;
        newZ += deltaZ;
      }
      if (keys && keys[39] ) {
        // console.log('RIGHT');
        // newX += metresPerStep;
        rotYAxis = (rotYAxis + radiansPerStep) % (2*Math.PI);
      }
      if (keys && keys[40] ) {
        // console.log('DOWN');
        // newZ -= metresPerStep;
        newX -= deltaX;
        newZ -= deltaZ;
      }
      // console.log(`newX = ${newX}`);
      // console.log(`newZ = ${newZ}`);
      // console.log(`newRotation = ${rotYAxis}`);
      let azimuth;
      if (newX === 0 && newZ === 0){
        azimuth = listenerPosition.azimuth;
      } else {
        azimuth = Math.atan(newZ / newX) + (newX < 0 ? Math.PI : 0)
      }
      let distance = Math.sqrt(newX ** 2 + newZ ** 2)
      // distance = Math.max(0.3, distance)
      distance = Math.min(distance, size)
      // console.log(`NEW AZIMUTH -> ${azimuth}`);
      // console.log(`NEW DISTANCE -> ${distance}`);
      // console.log(`NEW ROTATION -> ${rotYAxis*180/Math.PI}`);
      const newPos = { azimuth, distance, rotYAxis };

      this.setState({
        ...this.state,
        position: newPos,
      })

      onListenerChange(newPos);
    }
  }

  @autobind
  handleKeyUp(evt) {
    if (evt.keyCode === 37 || evt.keyCode === 38 || evt.keyCode === 39 || evt.keyCode === 40 ){
      const { keys } = this.state;
      keys[evt.keyCode] = false;
      if ( !keys[37] && !keys[38] && !keys[39] && !keys[40]) {
        this.setState(() => ({
          ...this.state,
          isMoving: false,
          currentObjectId: null,
          keys: {},
          }))
      } else {
        this.setState(() => ({
          ...this.state,
          keys,
        }))
      }
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
    const { isDragging, currentObjectId, position } = this.state

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
      // console.log(`newX = ${newX}`);
      // console.log(`newZ = ${newZ}`);
      let azimuth;
      if (newX === 0 && newZ === 0){
        azimuth = position.azimuth;
      } else {
        azimuth = Math.atan(-newZ / newX) + (newX < 0 ? Math.PI : 0)
      }
      const distance = size * Math.sqrt(newX ** 2 + newZ ** 2)
      // distance = Math.max(20, distance)
      // distance = Math.min(distance, size)
      // console.log(`NEW AZIMUTH -> ${azimuth}`);
      // console.log(`NEW DISTANCE -> ${Math.floor(distance)}`);
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
    // console.log(this.props.listenerPosition.azimuth);
    // transform: translate3d(`-50%, -50%, 0`),

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
              transform: `translate3d(-50%, -50%, 0) rotate(${listenerPosition.rotYAxis}rad)`
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
