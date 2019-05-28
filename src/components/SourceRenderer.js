/* global Math */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { clamp, values } from 'lodash'

import { DEFAULT_Z_POSITION, RoomShape } from 'src/constants'
import * as CustomPropTypes from 'src/prop-types.js'
import { navigateToSourceInMenu } from 'src/actions/navigation.actions.js'
import {
  setSourceSelected,
  setSourcePosition,
} from 'src/actions/sources.actions'
import * as colors from 'src/styles/colors.js'

/**
 * Returns a CSS transform scale value for a given z.
 *
 * This function assumes z >= 0
 */
function getScaleForZ(z, roomHeight) {
  if (z < DEFAULT_Z_POSITION) {
    // 0 <= z < default z --> scale 0.5 to 1
    return 0.5 + 0.5 * (z / DEFAULT_Z_POSITION)
  }
  if (DEFAULT_Z_POSITION <= z) {
    // default z <= z <= room height --> scale 1 to 2
    return 1 + (z - DEFAULT_Z_POSITION) / (roomHeight - DEFAULT_Z_POSITION)
  }

  return 1
}

/* ========================================================================== */

const Source = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
  transform: translate3d(-50%, -50%, 0);
`

const SourceReach = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: ${props => props.radiusSize * 2}px;
  height: ${props => props.radiusSize * 2}px;
  background: rgba(255, 255, 0, 0.2);
  border-radius: 50%;
  pointer-events: none;
`

const SourceBody = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0)
    scale(${props => getScaleForZ(props.position.z, props.roomHeight)});
  width: ${props => props.radiusSize * 2}px;
  height: ${props => props.radiusSize * 2}px;
  background: ${props => (props.enabled ? 'black' : 'transparent')};
  border-radius: 50%;
  border: 2px solid transparent;

  ${props =>
    props.isEnabled
      ? css`
          background: ${colors.BLACK};
          border: 2px solid transparent;
        `
      : css`
          background: transparent;
          border-color: ${colors.GREY};
        `}

  ${props =>
    props.isSelected &&
    css`
      background: ${colors.DARKBLUE};
    `}
`

const SourceLabel = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translate3d(-50%, -16px, 0);
  padding: 4px 8px;
  background: ${props => (props.isActive ? colors.DARKBLUE : colors.BLACK)};
  color: ${colors.WHITESMOKE};
  font-size: 12px;
`

/* ========================================================================== */
/* SOURCE RENDERER */
/* ========================================================================== */
class SourceRenderer extends Component {
  state = {
    isHovering: false,
    isDragging: false,
    hasDragged: false,
    // keys: {},
  }

  handleSourceMouseOver = () => {
    this.setState({
      isHovering: true,
    })
  }

  handleSourceMouseOut = () => {
    this.setState({
      isHovering: false,
    })
  }

  handleSourceMouseDown = () => {
    this.setState({
      isDragging: true,
    })
    window.addEventListener('mousemove', this.handleSourceMouseDrag)
    window.addEventListener('mouseup', this.handleSourceMouseUp)
  }

  handleSourceMouseDrag = e => {
    const {
      source,
      roomShape,
      roomWidth,
      roomDepth,
      containerSize,
      containerRect,
    } = this.props
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
        (-1 *
          (constrainedMouseY -
            (containerRect.top + containerSize.height / 2))) /
        (containerSize.height / 2)
      let newY =
        (-1 *
          (constrainedMouseX -
            (containerRect.left + containerSize.width / 2))) /
        (containerSize.width / 2)

      if (roomShape === RoomShape.ROUND && newX ** 2 + newY ** 2 > 1) {
        const theta = Math.atan(newY / newX) + (newX < 0 ? Math.PI : 0)
        const radius = roomWidth / 2
        newX = radius * Math.cos(theta)
        newY = radius * Math.sin(theta)
      } else {
        newX *= roomDepth / 2
        newY *= roomWidth / 2
      }

      this.props.setSourcePosition(source.name, {
        x: newX,
        y: newY,
        z: source.position.z,
      })

      this.setState({ hasDragged: true })
    }
  }

  handleSourceMouseUp = () => {
    const { source, onSelectSource, onClickSource } = this.props
    const { isDragging, hasDragged } = this.state

    window.removeEventListener('mousemove', this.handleSourceMouseDrag)
    window.removeEventListener('mouseup', this.handleSourceMouseUp)

    // Click -> toggle selected
    if (hasDragged === false) {
      onSelectSource(source.name, !source.selected)
      onClickSource(source.name)
    }

    // End of drag
    if (isDragging === true) {
      this.setState(() => ({
        isDragging: false,
        hasDragged: false,
      }))
    }
  }

  /* ------------------------------------------------------------------------ */
  render() {
    const {
      source,
      size,
      reachRadiusSize,
      roomWidth,
      roomHeight,
      roomDepth,
    } = this.props
    const { isHovering, isDragging } = this.state

    return (
      <Source
        key={name}
        style={{
          top: `${50 + (100 * -1 * source.position.x) / roomDepth}%`,
          left: `${50 + (100 * -1 * source.position.y) / roomWidth}%`,
        }}
      >
        {source.reach.enabled && <SourceReach radiusSize={reachRadiusSize} />}
        <SourceBody
          radiusSize={size / 2}
          position={source.position}
          roomHeight={roomHeight}
          isEnabled={source.enabled}
          isSelected={source.selected}
          onMouseOver={this.handleSourceMouseOver}
          onMouseOut={this.handleSourceMouseOut}
          onMouseDown={this.handleSourceMouseDown}
          style={{
            cursor: `${isDragging ? `grabbing` : `grab`}`,
          }}
        />
        {(source.selected || isHovering) && (
          <SourceLabel isActive={source.selected}>{source.name}</SourceLabel>
        )}
      </Source>
    )
  }
}

SourceRenderer.propTypes = {
  source: CustomPropTypes.source.isRequired,
  size: PropTypes.number.isRequired,
  reachRadiusSize: PropTypes.number.isRequired,
  roomWidth: PropTypes.number.isRequired,
  roomDepth: PropTypes.number.isRequired,
  roomHeight: PropTypes.number.isRequired,
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
  setSourcePosition: PropTypes.func.isRequired,
  onSelectSource: PropTypes.func.isRequired,
  onClickSource: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  roomWidth: state.room.size.width,
  roomDepth: state.room.size.depth,
  roomHeight: state.room.size.height,
  roomShape: state.room.shape,
})

const mapDispatchToProps = dispatch => ({
  setSourcePosition: (source, position) =>
    dispatch(setSourcePosition(source, position)),
  onSelectSource: (source, selected) =>
    dispatch(setSourceSelected(source, selected)),
  onClickSource: source => dispatch(navigateToSourceInMenu(source)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceRenderer)
