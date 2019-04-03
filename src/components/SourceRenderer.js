/* global Math */
import React, { Component} from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import * as colors from 'src/styles/colors'
import styled from 'styled-components'
import { clamp, pick, values } from 'lodash'

import { RoomShape } from 'src/constants'
import { setSourcePosition } from 'src/actions/sources.actions'

/**
 * Returns a CSS transform scale value for a given z.
 *
 * This function assumes z >= 0
 */
function getScaleForZ(z, roomHeight) {
  return 1 + (z / roomHeight)
}

/* ========================================================================== */
const Source = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0) scale(${props => getScaleForZ(props.position.z, props.roomHeight)});
  border-radius: 50%;
  background: ${props => (props.isSelected ? 'black' : 'transparent')};
  border: 2px solid ${props => (props.isSelected ? 'transparent' : 'gray')};
`
/* ========================================================================== */
/* SOURCE RENDERER */
/* ========================================================================== */
class SourceRenderer extends Component {

  state = {
    isDragging: false,
    // keys: {},
  }

  handleSourceMouseDown = () => {
    this.setState({
      isDragging: true,
    })
    window.addEventListener('mousemove', this.handleSourceMouseDrag)
    window.addEventListener('mouseup', this.handleSourceMouseUp)
  }

  handleSourceMouseDrag = (e) => {
    const { name, roomShape, roomWidth, roomDepth, containerSize, containerRect } = this.props
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

      this.props.setSourcePosition(
        this.props.name,
        { x: newX, y: newY, z: this.props.position.z }
      )
    }
  }

  handleSourceMouseUp = () => {
    window.removeEventListener('mousemove', this.handleSourceMouseDrag)
    window.removeEventListener('mouseup', this.handleSourceMouseUp)

    this.setState(() => ({
      ...this.state,
      isDragging: false,
    }))
  }

  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <Source
        key={this.props.name}
        isSelected={this.props.isSelected}
        roomHeight={this.props.roomHeight}
        position={this.props.position}
        style={{
          width: this.props.iconWidth,
          height: this.props.iconHeight,
          top: `${50 + (100 * -1 * this.props.position.x) / this.props.roomDepth}%`,
          left: `${50 + (100 * -1 * this.props.position.y) / this.props.roomWidth}%`,
          cursor: `${this.state.isDragging ? `grabbing` : `grab`}`,
        }}
        onMouseDown={this.handleSourceMouseDown}
      />
    )
  }
}

SourceRenderer.propTypes = {
  name: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
  }).isRequired,
  iconWidth: PropTypes.number.isRequired,
  iconHeight: PropTypes.number.isRequired,
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
}

const mapStateToProps = state => ({
  roomWidth: state.room.size.width,
  roomDepth: state.room.size.depth,
  roomHeight: state.room.size.height,
  roomShape: state.room.shape,
})

const mapDispatchToProps = dispatch => ({
  setSourcePosition: (source,position) => dispatch(setSourcePosition(source,position)),
})

export default connect(mapStateToProps,mapDispatchToProps)(SourceRenderer)
