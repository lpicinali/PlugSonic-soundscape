/* eslint no-unused-vars: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint react/prefer-stateless-function: 0 */
/* eslint no-lonely-if: 0 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import styled from 'styled-components'
import { clamp, pick } from 'lodash'

import * as colors from 'src/styles/colors'

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
  background-image: linear-gradient(
    to bottom right,
    ${colors.LIGHTBLUE},
    ${colors.ORANGE}
  );
`

const Source = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  border-radius: 100%;
  background: black;
`

/* ========================================================================== */
/* SOUNDSCAPE */
/* ========================================================================== */
class Soundscape extends Component {
  static propTypes = {
    size: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
    roomWidth: PropTypes.number.isRequired,
    roomDepth: PropTypes.number.isRequired,
  }

  render() {
    const { size, roomWidth, roomDepth } = this.props

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
        >
          <div>
            Soundscape
            <br />
            Normal resolution: {PIXELS_PER_METER} px/m
            <br />
            Rendered resolution: {viewportResolution} px/m
            <br />
            Relative scale: {relativeScale}
          </div>

          <Source
            style={{
              width: sourceSize,
              height: sourceSize,
            }}
          />
        </SoundscapeRoom>
      </SoundscapeContainer>
    )
  }
}

const mapStateToProps = state => ({
  roomWidth: state.room.size.width,
  roomDepth: state.room.size.depth,
})

export default connect(
  mapStateToProps,
  null
)(Soundscape)
