/* eslint react/prefer-stateless-function: 0 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { values } from 'lodash'
import { PlaybackState } from 'src/constants.js'
import { setPlaybackState } from 'src/actions/controls.actions.js'
import { StyledPlayButton, StyledPauseButton } from 'src/containers/PlaybackControlsContainer.style'

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
)(PlaybackControlsContainer)
