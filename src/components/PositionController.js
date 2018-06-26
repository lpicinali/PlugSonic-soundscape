/* global window */
/* eslint react/forbid-prop-types: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint prefer-destructuring: 0 */

/* ------------------- NOTES -------------------- */ /*

TO DO:
  - minimum distance between sources and/or listener:
    - circle constraint
  - listener keyboard movement bug:
    - listener stops when changing from 2 to 1 keys pressed
  - allow only for rotation when dragging listener with mouse
  - bug continue to drag listener after drag and rotation
  - tune listener movement with room resizing
  - arow keys listeners only when click on the room

*/ /* ---------------------------------------------- */

import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { clamp, throttle } from 'lodash'
import { autobind } from 'core-decorators'
import * as CustomPropTypes from 'src/prop-types.js'
import { StyledPositionController, ListenerHandle, SourceReach, SourceHandle } from 'src/components/PositionController.style'

function calculateObjectCssPosition(object, container) {
  const top = Math.sin(object.azimuth) * object.distance / container.height
  const left = Math.cos(object.azimuth) * object.distance / container.width

  return { top, left }
}

// let touchScrollX
// let touchScrollY

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
    onListenerChange: PropTypes.func.isRequired,
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

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  @autobind
  handleKeyDown(e) {
    if ( e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 ) {
      e.preventDefault()

      if (!this.state.isDragging) {
        const { isRound, sizeX, sizeZ, onListenerChange, listenerPosition } = this.props
        const { keys } = this.state
        keys[e.keyCode] = true

        this.setState(() => ({
          ...this.state,
          isMoving: true,
          currentObjectId: 'listener',
          keys,
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
        if (keys && keys[37]) {
          rotYAxis = (rotYAxis - radiansPerStep) % (2 * Math.PI)
          if (rotYAxis < 0) {
            rotYAxis = 2 * Math.PI + rotYAxis
          }
        }
        if (keys && keys[38]) {
          newX += deltaX
          newZ += deltaZ
        }
        if (keys && keys[39]) {
          rotYAxis = (rotYAxis + radiansPerStep) % (2 * Math.PI)
        }
        if (keys && keys[40]) {
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

        onListenerChange(newPos)
      }
    }
  }

  @autobind
  handleKeyUp(e) {
    if ( e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 ) {
      const { keys } = this.state
      keys[e.keyCode] = false
      if (!keys[37] && !keys[38] && !keys[39] && !keys[40]) {
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
    let object
    if (objectId === 'listener') {
      object = this.props.listenerPosition
      this.setState(() => ({
        isDragging: true,
        currentObjectId: objectId,
        position: {
          azimuth: object.azimuth,
          distance: object.distance,
          rotYAxis: object.rotYAxis,
        },
      }))
    } else {
      object = this.props.objects.find(x => x.id === objectId)
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
  handleDrag(e) {
    const { bounds, isRound, sizeX, sizeZ, onPositionChange, onListenerChange } = this.props
    const { isDragging, currentObjectId, position } = this.state

    if (isDragging) {
      const rect = bounds

      const constrainedMouseX = clamp(
        e.pageX,
        window.scrollX + rect.left,
        window.scrollX + rect.left + rect.width
      )
      const constrainedMouseY = clamp(
        e.pageY,
        window.scrollY + rect.top,
        window.scrollY + rect.top + rect.height
      )

      let newX =
        (constrainedMouseX - (window.scrollX + rect.left + rect.width / 2)) /
        (rect.width / 2)
      let newZ =
        (constrainedMouseY - (window.scrollY + rect.top + rect.height / 2)) /
        (rect.height / 2)

      if (isRound) {
        newX *= sizeX
        newZ *= sizeX
      } else {
        newX *= sizeX
        newZ *= sizeZ
      }

      let azimuth
      if (newX === 0 && newZ === 0) {
        azimuth = position.azimuth
      } else {
        azimuth = Math.atan(-newZ / newX) + (newX < 0 ? Math.PI : 0)
      }
      let distance = Math.sqrt(newX ** 2 + newZ ** 2)
      if (isRound) {
        distance = Math.min(distance, sizeX)
      }
      const rotYAxis = position.rotYAxis

      this.setState({
        ...this.state,
        position: { azimuth, distance, rotYAxis },
      })

      if (currentObjectId === 'listener') {
        onListenerChange({ azimuth, distance, rotYAxis })
      } else {
        onPositionChange(currentObjectId, { azimuth, distance })
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

  @autobind
  handleTouchStart(objectId) {
    // console.log('touch start')
    let object
    if (objectId === 'listener') {
      object = this.props.listenerPosition
      this.setState(() => ({
        isDragging: true,
        currentObjectId: objectId,
        position: {
          azimuth: object.azimuth,
          distance: object.distance,
          rotYAxis: object.rotYAxis,
        },
      }))
    } else {
      object = this.props.objects.find(x => x.id === objectId)
      this.setState(() => ({
        isDragging: true,
        currentObjectId: objectId,
        position: { azimuth: object.azimuth, distance: object.distance },
      }))

      this.props.onSelectTarget(objectId)
    }

    // touchScrollX = window.scrollX
    // touchScrollY = window.scrollY
    // console.log(`window.scroll = ${touchScrollX},${touchScrollY}`)
    window.addEventListener('touchmove', this.handleTouchMove, false)
    window.addEventListener('touchend', this.handleTouchEnd, false)
    // window.addEventListener('scroll', this.handleScroll, true)
    // window.addEventListener("mousewheel", this.handleMouseWheel, true)
    // window.addEventListener("DOMMouseScroll", this.handleMouseWheel, true)
  }

  @autobind
  handleMouseWheel(e) {
    console.log('wheel')
    e.preventDefault()
    window.scrollTo(touchScrollX,touchScrollY)
    console.log(`window.scroll = ${touchScrollX},${touchScrollY}`)
  }

  @autobind
  handleScroll(e) {
    console.log('scroll')
    e.preventDefault()
    window.scrollTo(touchScrollX,touchScrollY)
    console.log(`window.scroll = ${touchScrollX},${touchScrollY}`)
  }

  @autobind
  handleTouchMove(e) {
    // console.log('touch move')
    e.preventDefault()
    // window.scrollTo(touchScrollX,touchScrollY)
    // console.log(`window.scroll = ${touchScrollX},${touchScrollY}`)
    const {
      bounds,
      isRound,
      sizeX,
      sizeZ,
      onPositionChange,
      onListenerChange,
    } = this.props

    const { isDragging, currentObjectId, position } = this.state

    if (isDragging && e.targetTouches.length === 1) {
      const rect = bounds

      const constrainedMouseX = clamp(
        e.targetTouches[0].pageX,
        window.scrollX + rect.left,
        window.scrollX + rect.left + rect.width
      )
      const constrainedMouseY = clamp(
        e.targetTouches[0].pageY,
        window.scrollY + rect.top,
        window.scrollY + rect.top + rect.height
      )

      let newX =
        (constrainedMouseX - (window.scrollX + rect.left + rect.width / 2)) /
        (rect.width / 2)
      let newZ =
        (constrainedMouseY - (window.scrollY + rect.top + rect.height / 2)) /
        (rect.height / 2)

      if (isRound) {
        newX *= sizeX
        newZ *= sizeX
      } else {
        newX *= sizeX
        newZ *= sizeZ
      }

      let azimuth
      if (newX === 0 && newZ === 0) {
        azimuth = position.azimuth
      } else {
        azimuth = Math.atan(-newZ / newX) + (newX < 0 ? Math.PI : 0)
      }
      let distance = Math.sqrt(newX ** 2 + newZ ** 2)
      if (isRound) {
        distance = Math.min(distance, sizeX)
      }
      const rotYAxis = position.rotYAxis

      this.setState({
        ...this.state,
        position: { azimuth, distance, rotYAxis },
      })

      if (currentObjectId === 'listener') {
        onListenerChange({ azimuth, distance, rotYAxis })
      } else {
        onPositionChange(currentObjectId, { azimuth, distance })
      }
    }
  }

  @autobind
  handleTouchEnd(e) {
    // console.log('touch end')
    // e.preventDefault()
    window.removeEventListener('touchmove', this.handleTouchMove)
    window.removeEventListener('touchend', this.handleTouchEnd)
    // window.removeEventListener('scroll', this.handleScroll)
    // window.removeEventListener("mousewheel", this.handleMouseWheel)
    // window.removeEventListener("DOMMouseScroll", this.handleMouseWheel);

    this.setState(() => ({
      ...this.state,
      isDragging: false,
      currentObjectId: null,
    }))
  }

  render() {
    const { bounds, isRound, sizeX, sizeZ, objects, editingTarget, listenerPosition, headRadius } = this.props

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
          onTouchStart={() => this.handleTouchStart('listener')}
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
                reach={object.reach.radius}
                pixelsPerMeter={pixelsPerMeter}
                isEditing={editingTarget === object.id}
                style={objectStyles}
              />
              <SourceHandle
                onMouseDown={() => this.handlePress(object.id)}
                onTouchStart={() => this.handleTouchStart(object.id)}
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
