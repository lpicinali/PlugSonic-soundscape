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
import { RoomShape } from 'src/constants.js'

import ListenerRenderer from 'src/components/ListenerRenderer'
import SourceRenderer from 'src/components/SourceRenderer'
/* ========================================================================== */
const PIXELS_PER_METER = 10
const SOURCE_SIZE_METERS = 1
/* ========================================================================== */
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
  border-radius: ${props => props.roomShape === RoomShape.ROUND ? '9999px' : '5px'};
`
/* ========================================================================== */
/* SOUNDSCAPE INTERFACE
/* ========================================================================== */
/*
* The listener and sources are positioned using a meter-based coordinate
* system, with {0, 0} being in the center and {1, 1} pointing north-west.
*
* Points are {x, y}.
*/
class ScaledSoundscape extends Component {

  /* ------------------------------------------------------------------------ */
  render() {
    const {
      size,
      rect,
      roomWidth,
      roomDepth,
      roomShape,
      roomImage,
      listenerPosition,
      listenerRotation,
      sources,
    } = this.props

    // console.log(rect)
    const roomRatio = roomWidth / roomDepth
    const containerRatio = size.width / size.height

    const viewportWidth =
      roomRatio >= containerRatio ? size.width : roomRatio * size.height
    const viewportHeight = viewportWidth / roomRatio

    const viewportResolution = viewportWidth / roomWidth
    const relativeScale = viewportResolution / PIXELS_PER_METER

    let sourceSize = relativeScale * SOURCE_SIZE_METERS * PIXELS_PER_METER
    if (sourceSize > 50) {
      sourceSize = 50
    }
    if (sourceSize < 15) {
      sourceSize = 15
    }

    const viewportLeft =
      roomRatio >= containerRatio ? rect.left : rect.left + (size.width - viewportWidth) / 2
    const viewportRight =
      roomRatio >= containerRatio ? rect.right : viewportLeft + viewportWidth
    const viewportTop =
      roomRatio >= containerRatio ? rect.top + (size.height - viewportHeight) / 2 : rect.top
    const viewportBottom =
      roomRatio >= containerRatio ? viewportTop + viewportHeight : rect.bottom



    return (
      <SoundscapeContainer>
        <SoundscapeRoom
          style={{
            width: viewportWidth,
            height: viewportHeight,
          }}
          roomShape={roomShape}
          imageUrl={roomImage}
        >

          {/* <div>
            Soundscape
            <br />
            Normal resolution: {PIXELS_PER_METER} px/m
            <br />
            Rendered resolution: {viewportResolution} px/m
            <br />
            Relative scale: {relativeScale}
          </div> */}

          <ListenerRenderer
            iconWidth={sourceSize*1.4}
            iconHeight={sourceSize*1.4}
            containerSize={{width: viewportWidth, height: viewportHeight}}
            containerRect={{top: viewportTop, bottom: viewportBottom, left: viewportLeft, right: viewportRight}}
          />

          {/* {sources.map(source => (
            <Source
              key={source.name}
              isSelected={source.selected === true}
              style={{
            width: sourceSize,
            height: sourceSize,
            top: `${50 + (100 * -1 * source.position.x) / roomDepth}%`,
            left: `${50 + (100 * -1 * source.position.y) / roomWidth}%`,
              }}
            />
          ))} */}
          {sources.map(source => (
            <SourceRenderer
              key={source.name}
              source={source}
              size={sourceSize}
              reachRadiusSize={source.reach.radius * PIXELS_PER_METER * relativeScale}
              containerSize={{width: viewportWidth, height: viewportHeight}}
              containerRect={{top: viewportTop, bottom: viewportBottom, left: viewportLeft, right: viewportRight}}
            />
          ))}
        </SoundscapeRoom>
      </SoundscapeContainer>
    )
  }
}

ScaledSoundscape.propTypes = {
  size: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  rect: PropTypes.shape({
    top: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
  }).isRequired,
  roomWidth: PropTypes.number.isRequired,
  roomDepth: PropTypes.number.isRequired,
  roomShape: PropTypes.oneOf(values(RoomShape)).isRequired,
  roomImage: PropTypes.string,
  listenerPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
  }).isRequired,
  listenerRotation: PropTypes.number.isRequired,
  sources: PropTypes.arrayOf(CustomPropTypes.source).isRequired,
}

ScaledSoundscape.defaultProps = {
  roomImage: '',
}

const mapStateToProps = state => ({
  roomWidth: state.room.size.width,
  roomDepth: state.room.size.depth,
  roomImage: state.room.backgroundImage.raw,
  roomShape: state.room.shape,
  listenerPosition: state.listener.position,
  listenerRotation: state.listener.position.rotZAxis,
  sources: values(state.sources.sources),
})

export default connect(mapStateToProps,null)(ScaledSoundscape)
