import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { values } from 'lodash'

import { IconButton } from '@material-ui/core'
import PlayIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'
import RecordIcon from '@material-ui/icons/FiberManualRecord'
import SettingsIcon from '@material-ui/icons/Settings'
import ArrowIcon from '@material-ui/icons/ChevronRight'
import ArrowsIcon from '@material-ui/icons/Games'

import { PlaybackState } from 'src/constants.js'
import {
  setPlaybackState,
  showSettingsDrawer,
  hideSettingsDrawer,
  showArrowsDrawer,
  hideArrowsDrawer,
} from 'src/actions/controls.actions'
/* ========================================================================== */
const FlatButtonStyle = {
  minWidth: '48px',
  minHeight: '48px',
  padding: '0px 0px',
}
const SettingsButtonStyle = {
  minWidth: '48px',
  minHeight: '48px',
  padding: '0px 0px',
  marginLeft: 'auto',
}
/* ========================================================================== */
/* NAV CONTROLS */
/* ========================================================================== */
class NavControls extends Component {
  toggleSettings = () => {
    this.props.showSettingsDrawer
      ? this.props.onHideSettingsDrawer()
      : this.props.onShowSettingsDrawer()
  }

  toggleArrows = () => {
    this.props.showArrowsDrawer
      ? this.props.onHideArrowsDrawer()
      : this.props.onShowArrowsDrawer()
  }

  /* ------------------------------------------------------------------------ */
  render() {
    const DrawerIcon = this.props.showSettingsDrawer ? (
      <ArrowIcon color="secondary" />
    ) : (
      <SettingsIcon color="secondary" />
    )

    return (
      <React.Fragment>
        <IconButton
          style={FlatButtonStyle}
          disabled={
            this.props.playbackState === PlaybackState.PLAY ||
            this.props.playbackState === PlaybackState.RECORD
          }
          onClick={() => this.props.onPlaybackStateChange(PlaybackState.PLAY)}
        >
          <PlayIcon
            color={
              this.props.playbackState === PlaybackState.PLAY ||
              this.props.playbackState === PlaybackState.RECORD
                ? 'error'
                : 'secondary'
            }
          />
        </IconButton>

        <IconButton
          style={FlatButtonStyle}
          disabled={this.props.playbackState === PlaybackState.STOP}
          onClick={() => this.props.onPlaybackStateChange(PlaybackState.STOP)}
        >
          <StopIcon color="secondary" />
        </IconButton>

        <IconButton
          style={FlatButtonStyle}
          disabled={this.props.playbackState === PlaybackState.RECORD}
          onClick={() => this.props.onPlaybackStateChange(PlaybackState.RECORD)}
        >
          <RecordIcon
            color={
              this.props.playbackState === PlaybackState.RECORD
                ? 'error'
                : 'secondary'
            }
          />
        </IconButton>

        <IconButton style={FlatButtonStyle} onClick={this.toggleArrows}>
          <ArrowsIcon color="secondary" />
        </IconButton>

        <IconButton style={SettingsButtonStyle} onClick={this.toggleSettings}>
          {DrawerIcon}
        </IconButton>
      </React.Fragment>
    )
  }
}

NavControls.propTypes = {
  playbackState: PropTypes.oneOf(values(PlaybackState)).isRequired,
  showSettingsDrawer: PropTypes.bool.isRequired,
  showArrowsDrawer: PropTypes.bool.isRequired,
  onShowSettingsDrawer: PropTypes.func.isRequired,
  onHideSettingsDrawer: PropTypes.func.isRequired,
  onShowArrowsDrawer: PropTypes.func.isRequired,
  onHideArrowsDrawer: PropTypes.func.isRequired,
  onPlaybackStateChange: PropTypes.func.isRequired,
}

NavControls.defaultProps = {
  showSettingsDrawer: false,
  showArrowsDrawer: false,
}

const mapStateToProps = state => ({
  playbackState: state.controls.playbackState,
  showSettingsDrawer: state.controls.showSettingsDrawer,
  showArrowsDrawer: state.controls.showArrowsDrawer,
})

const mapDispatchToProps = dispatch => ({
  onPlaybackStateChange: state => dispatch(setPlaybackState(state)),
  onShowSettingsDrawer: () => dispatch(showSettingsDrawer()),
  onHideSettingsDrawer: () => dispatch(hideSettingsDrawer()),
  onShowArrowsDrawer: () => dispatch(showArrowsDrawer()),
  onHideArrowsDrawer: () => dispatch(hideArrowsDrawer()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavControls)
