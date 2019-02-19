/* eslint no-unused-vars: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint react/prefer-stateless-function: 0 */
/* eslint no-lonely-if: 0 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { clamp, pick, values } from 'lodash'

import * as CustomPropTypes from 'src/prop-types.js'
import * as colors from 'src/styles/colors.js'

const PIXELS_PER_METER = 10
const SOURCE_SIZE_METERS = 1

const SoundscapeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: ${colors.WHITE};
`

const SoundscapeRoom = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  overflow: hidden;
  background-color: ${colors.GREY};
  background-image: url(${props => props.imageUrl});
  background-size: cover;
`

const Listener = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  border-radius: 100%;
  background: ${colors.LIGHTBLUE};
`

const Source = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  border-radius: 100%;
  background: ${props => (props.isSelected ? 'black' : 'transparent')};
  border: 2px solid ${props => (props.isSelected ? 'transparent' : 'gray')};
`

/**
 * Soundscape
 *
 * The listener and sources are positioned using a meter-based coordinate
 * system, with {0, 0} being in the center.
 */
class Soundscape extends Component {
  static propTypes = {
    size: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
    roomWidth: PropTypes.number.isRequired,
    roomDepth: PropTypes.number.isRequired,
    roomImage: PropTypes.string,
    listenerPosition: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      z: PropTypes.number.isRequired,
    }).isRequired,
    sources: PropTypes.arrayOf(CustomPropTypes.source).isRequired,
  }

  static defaultProps = {
    roomImage: '',
  }

  render() {
    const {
      size,
      roomWidth,
      roomDepth,
      roomImage,
      listenerPosition,
      sources,
    } = this.props

    const roomRatio = roomWidth / roomDepth
    const containerRatio = size.width / size.height

    const viewportWidth =
      roomRatio >= containerRatio ? size.width : roomRatio * size.height
    const viewportHeight = viewportWidth / roomRatio

    const viewportResolution = viewportWidth / roomWidth
    const relativeScale = viewportResolution / PIXELS_PER_METER

    const sourceSize = relativeScale * SOURCE_SIZE_METERS * PIXELS_PER_METER

    return (
      <SoundscapeContainer>
        <SoundscapeRoom
          style={{
            width: viewportWidth,
            height: viewportHeight,
          }}
          imageUrl={roomImage}
        >
          <div>
            Soundscapez
            <br />
            Normal resolution: {PIXELS_PER_METER} px/m
            <br />
            Rendered resolution: {viewportResolution} px/m
            <br />
            Relative scale: {relativeScale}
          </div>

          <Listener
            style={{
              width: sourceSize,
              height: sourceSize,
              top: `${50 + (100 * listenerPosition.z) / roomDepth}%`,
              left: `${50 + (100 * listenerPosition.x) / roomWidth}%`,
            }}
          />

          {sources.map(source => (
            <Source
              key={source.name}
              isSelected={source.selected === true}
              style={{
                width: sourceSize,
                height: sourceSize,
                top: `${50 + (100 * source.position.z) / roomDepth}%`,
                left: `${50 + (100 * source.position.x) / roomWidth}%`,
              }}
            />
          ))}
        </SoundscapeRoom>
      </SoundscapeContainer>
    )
  }
}

const mapStateToProps = state => ({
  roomWidth: state.room.size.width,
  roomDepth: state.room.size.depth,
  roomImage: state.room.image.raw,
  listenerPosition: state.listener.position,
  sources: values(state.sources.sources),
})

export default connect(
  mapStateToProps,
  null
)(Soundscape)
