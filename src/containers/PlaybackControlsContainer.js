/* eslint react/prefer-stateless-function: 0 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { values } from 'lodash'
import { PlayButton, PauseButton } from 'react-player-controls'
import styled from 'styled-components'

import { PlaybackState } from 'src/constants.js'
import { setPlaybackState } from 'src/actions/controls.actions.js'
import { BLUE, TURQOISE, WHITE } from 'src/styles/colors.js'

const FloatingPlaybackController = styled.div`
  position: fixed;
  bottom: 32px;
  left: 80%;
  transform: translateX(-50%);
`

const buttonStyles = `
  appearance: none;
  width: 72px !important;
  height: 56px !important;
  padding: 0 8px;
  background: ${BLUE};
  border: none;
  border-radius: 3px;
  outline: none;
  cursor: pointer;

  &:hover {
    background: ${TURQOISE};
  }

  svg {
    width: 32px;
    height: 32px;
  }

  polygon,
  rect {
    fill: ${WHITE};
  }
`

const StyledPlayButton = styled(PlayButton)`${buttonStyles};`
const StyledPauseButton = styled(PauseButton)`${buttonStyles};`

/**
 * Playback Controls Container
 */
class PlaybackControlsContainer extends Component {
  static propTypes = {
    playbackState: PropTypes.oneOf(values(PlaybackState)).isRequired,
    onStateChange: PropTypes.func.isRequired,
  }

  render() {
    const { playbackState, onStateChange } = this.props

    return (
      <FloatingPlaybackController>
        {playbackState === PlaybackState.PAUSED ? (
          <StyledPlayButton
            isEnabled
            onClick={() => onStateChange(PlaybackState.PLAYING)}
            style={{ width: 40, height: 40 }}
          />
        ) : (
          <StyledPauseButton
            isEnabled
            onClick={() => onStateChange(PlaybackState.PAUSED)}
            style={{ width: 40, height: 40 }}
          />
        )}
      </FloatingPlaybackController>
    )
  }
}

export default connect(
  state => ({
    playbackState: state.controls.playbackState,
  }),
  dispatch => ({
    onStateChange: state => dispatch(setPlaybackState(state)),
  })
)(PlaybackControlsContainer)
