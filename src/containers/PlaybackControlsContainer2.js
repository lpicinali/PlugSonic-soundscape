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

const buttonStyles = `
  appearance: none;
  width: 64px !important;
  height: 48px !important;
  display: inline-block;
  margin-top: 10px;
  padding: 0 8px;
  background: ${BLUE};
  border: none;
  border-radius: 5px;
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

const StyledPlayButton = styled(PlayButton)`
  ${buttonStyles};
`
const StyledPauseButton = styled(PauseButton)`
  ${buttonStyles};
`

/**
 * Playback Controls Container
 */
class PlaybackControlsContainer2 extends Component {
  static propTypes = {
    playbackState: PropTypes.oneOf(values(PlaybackState)).isRequired,
    onStateChange: PropTypes.func.isRequired,
  }

  render() {
    const { playbackState, onStateChange } = this.props

    return (
      <div>
        {playbackState === PlaybackState.PAUSED ? (
          <StyledPlayButton
            isEnabled
            onClick={() => onStateChange(PlaybackState.PLAYING)}
          />
        ) : (
          <StyledPauseButton
            isEnabled
            onClick={() => onStateChange(PlaybackState.PAUSED)}
          />
        )}
      </div>
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
)(PlaybackControlsContainer2)
