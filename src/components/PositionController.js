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
  - bug continue to drag listener after drag and rotation
  - tune listener movement with room resizing

*//* ---------------------------------------------- */

import React, { Component, Fragment } from 'react'
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
  overflow: hidden;
  background-color: ${WHITESMOKE};
  border: 1px solid ${BLUE};
  border-radius: ${props => props.isRound ? '9999px' : '5px'};
  transition: all 1s;
`
// width: ${props => props.size};
// height: ${props => props.size};
// transform: rotate(${props => props.listenerPosition.azimuth} rad)
  // transform: translate3d(-8px, -10px, 0);

const ListenerHandle = styled.div`
  position: relative;
  z-index: 5;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 6px 14px 6px;
  border-color: transparent transparent ${BLACK} transparent;
  position: absolute;
  text-indent: -9999px;
  overflow: hidden;
  cursor: pointer;
`

const SourceReach = styled.div`
  position: absolute;
  z-index: ${props => props.isEditing ? 2 : 1};
  width: ${props => props.reach * props.pixelsPerMeter.x}px;
  height: ${props => props.reach * props.pixelsPerMeter.z}px;
  background: ${props => props.isEditing ? 'rgba(243, 36, 106, 0.1)' : '#e8e8eb'};
  border: 1px solid ${props => props.isEditing ? '#f3246a' : 'transparent'};
  border-radius: 100%;
  transform: translate3d(-50%, -50%, 0);
`

const SourceHandle = styled.div`
  position: absolute;
  z-index: 2;
  width: 12px;
  height: 12px;
  background: ${TURQOISE};
  border-radius: 100%;
  cursor: pointer;
  transform: translate3d(-25%, -25%, 0);
`

function calculateObjectCssPosition(object, container) {
  const top = Math.sin(object.azimuth) * object.distance / container.height
  const left = Math.cos(object.azimuth) * object.distance / container.width

  return { top, left }
}

/**
 * Position Controller
 */
class PositionController extends Component {
  static propTypes = {
    bounds: CustomPropTypes.rect.isRequired,
    isRound: PropTypes.bool.isRequired,
    sizeX: PropTypes.number.isRequired,
    sizeZ: PropTypes.number.isRequired,
    objects: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        azimuth: PropTypes.number.isRequired,
        distance: PropTypes.number.isRequired,
      })
    ).isRequired,
    editingTarget: PropTypes.string,
    listenerPosition: PropTypes.object.isRequired,
    headRadius: PropTypes.number.isRequired,
    onSelectTarget: PropTypes.func.isRequired,
    onPositionChange: PropTypes.func.isRequired,
    onListenerChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    editingTarget: null,
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

      const { isRound, sizeX, sizeZ, onListenerChange, listenerPosition } = this.props
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

      const metresPerStep = (1 - (1.05 ** (-Math.max(sizeX,sizeZ)))) * 0.75 ;
      const radiansPerStep = Math.min(Math.PI/((1.05 ** (-Math.max(sizeX,sizeZ)))*48),Math.PI/24);

      let newX = Math.cos(listenerPosition.azimuth) * listenerPosition.distance;
      let newZ = Math.sin(listenerPosition.azimuth) * listenerPosition.distance;
      let rotYAxis = listenerPosition.rotYAxis;
      let deltaX = Math.sin(listenerPosition.rotYAxis) * metresPerStep;
      let deltaZ = Math.cos(listenerPosition.rotYAxis) * metresPerStep;
      if (!isRound) {
        if ( Math.abs(newX+deltaX) > sizeX ) {
          if ( newX >= 0 ) {
            deltaX = sizeX - newX;
          } else {
            deltaX = -sizeX - newX
          }
          if ( Math.abs(deltaZ) >= 0.01 ) {
            deltaZ = deltaX * (Math.tan(rotYAxis));
          } else {
            deltaZ = 0;
          }
        }
        if ( Math.abs(newZ+deltaZ) > sizeZ ) {
          if ( newZ >= 0 ) {
            deltaZ = sizeZ - newZ;
          } else {
            deltaZ = -sizeZ - newZ;
          }
          if ( Math.abs(deltaX) >= 0.01 ) {
            deltaX = deltaZ * (1 / Math.tan(rotYAxis));
          } else {
            deltaX = 0;
          }
        }
      }
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
      // console.log(`deltaX = ${deltaX}`);
      // console.log(`deltaZ = ${deltaZ}`);
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
      if (isRound) {
        distance = Math.min(distance, sizeX)
      }
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
      this.setState(() => ({
        isDragging: true,
        currentObjectId: objectId,
        position: { azimuth: object.azimuth, distance: object.distance, rotYAxis: object.rotYAxis },
      }))
    } else {
      object = this.props.objects.find(x => x.id === objectId);
      this.setState(() => ({
        isDragging: true,
        currentObjectId: objectId,
        position: { azimuth: object.azimuth, distance: object.distance },
      }))

      this.props.onSelectTarget(objectId)
    }

    window.addEventListener('mousemove', this.handleDrag)
    window.addEventListener('mouseup', this.handleRelease)
  }

  @autobind
  handleDrag(evt) {
    const { bounds, isRound, sizeX, sizeZ, onPositionChange, onListenerChange } = this.props
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

      let newX =
        (constrainedMouseX - (window.scrollX + rect.left + rect.width / 2)) /
        (rect.width / 2)
      let newZ =
        (constrainedMouseY - (window.scrollY + rect.top + rect.height / 2)) /
        (rect.height / 2)

      // if (!isRound) {
      //   if (sizeX > sizeZ) {
      //     newZ *= sizeZ/sizeX;
      //   } else if ( sizeZ > sizeX) {
      //     newX *= sizeX/sizeZ;
      //   }
      // }
      if (isRound) {
        newX *= sizeX;
        newZ *= sizeX;
      } else {
        newX *= sizeX;
        newZ *= sizeZ;
      }
      // console.log(`newX = ${newX}`);
      // console.log(`newZ = ${newZ}`);
      let azimuth;
      if (newX === 0 && newZ === 0){
        azimuth = position.azimuth;
      } else {
        azimuth = Math.atan(-newZ / newX) + (newX < 0 ? Math.PI : 0)
      }
      let distance = Math.sqrt(newX ** 2 + newZ ** 2)
      if (isRound) {
        distance = Math.min(distance, sizeX)
      }
      const rotYAxis = position.rotYAxis;
      // console.log(`NEW AZIMUTH -> ${azimuth}`);
      // console.log(`NEW DISTANCE -> ${Math.floor(distance)}`);

      this.setState({
        ...this.state,
        position: { azimuth, distance, rotYAxis },
      })

      if (currentObjectId === 'listener') {
        onListenerChange({ azimuth, distance, rotYAxis });
      } else {
        onPositionChange(currentObjectId, { azimuth, distance });
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
    const { bounds, isRound, sizeX, sizeZ, objects, editingTarget, listenerPosition, headRadius } = this.props

    // console.log('PositionController.render()', bounds.top)
    // console.log(this.props.listenerPosition.azimuth);
    // transform: translate3d(`-50%, -50%, 0`),

    // console.log(`isRound = ${isRound}`);

    // console.log(`bounds.width = ${bounds.width}`)
    // console.log(`bounds.height = ${bounds.height}`)

    const pixelsPerMeter = {
      x: bounds.width / sizeX,
      z: bounds.height / (isRound === true ? sizeX : sizeZ),
    }
    const areaSize = {
      width: sizeX,
      height: isRound === true ? sizeX : sizeZ,
    }
    const listenerCssPosition = calculateObjectCssPosition(listenerPosition, areaSize)

    return (
      <StyledPositionController
        width={bounds.width}
        height={bounds.height}
        isRound={isRound}
      >
        <ListenerHandle
          key='listener'
          style={{
            top: `${50 - 50 * listenerCssPosition.top}%`,
            left: `${50 + 50 * listenerCssPosition.left}%`,
            transform: `translate3d(-50%, -50%, 0) rotate(${listenerPosition.rotYAxis}rad)`,
          }}
          size={`calc(${100 * (headRadius / 0.5) * (sizeX / 12) / sizeX}% + 8px)`}
          onMouseDown={() => this.handlePress('listener')}
        >
          <span>listener</span>
        </ListenerHandle>

        {objects.map(object => {
          const objectCssPosition = calculateObjectCssPosition(object, areaSize)
          const objectStyles = {
            top: `${50 - 50 * objectCssPosition.top}%`,
            left: `${50 + 50 * objectCssPosition.left}%`,
          }

          return (
            <Fragment key={object.id}>
              <SourceReach
                reach={object.reach}
                pixelsPerMeter={pixelsPerMeter}
                isEditing={editingTarget === object.id}
                style={objectStyles}
              />
              <SourceHandle
                onMouseDown={() => this.handlePress(object.id)}
                style={objectStyles}
              />
            </Fragment>
          )
        })}
      </StyledPositionController>
    )
  }
}

export default PositionController
