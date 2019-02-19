import React, { Component} from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { values } from 'lodash'
import * as colors from 'src/styles/colors'

import FlatButton from "material-ui/FlatButton"
import PlayIcon from "material-ui/svg-icons/av/play-arrow"
import StopIcon from "material-ui/svg-icons/av/stop"
import SettingsIcon from "material-ui/svg-icons/action/settings"
import ArrowIcon from "material-ui/svg-icons/navigation/chevron-right"

import { PlaybackState } from 'src/constants.js'
import { setPlaybackState, showSettingsDrawer, hideSettingsDrawer } from 'src/actions/controls.actions'
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
  marginLeft: 'auto'
}
/* ========================================================================== */
/* NAV CONTROLS */
/* ========================================================================== */
class NavControls extends Component {

  toggleSettings = () => {
    this.props.showSettingsDrawer ? this.props.onHideSettingsDrawer() : this.props.onShowSettingsDrawer()
  }

  /* ------------------------------------------------------------------------ */
  render() {
    const DrawerIcon = this.props.showSettingsDrawer ?
      <ArrowIcon color={colors.WHITE}/> : <SettingsIcon color={colors.WHITE}/>

    return (
      <React.Fragment>
        <FlatButton
          icon={<PlayIcon color={colors.WHITE}/>}
          style={FlatButtonStyle}
          disabled={this.props.playbackState === PlaybackState.PLAY}
          onClick={() => this.props.onPlaybackStateChange(PlaybackState.PLAY)}
        />

        <FlatButton
          icon={<StopIcon color={colors.WHITE}/>}
          style={FlatButtonStyle}
          disabled={this.props.playbackState === PlaybackState.STOP}
          onClick={() => this.props.onPlaybackStateChange(PlaybackState.STOP)}
        />

        <FlatButton
          icon={DrawerIcon}
          style={SettingsButtonStyle}
          onClick={this.toggleSettings}
        />
      </React.Fragment>
    )
  }
}

NavControls.propTypes = {
  playbackState: PropTypes.oneOf(values(PlaybackState)).isRequired,
  showSettingsDrawer: PropTypes.bool.isRequired,
  onShowSettingsDrawer: PropTypes.func.isRequired,
  onHideSettingsDrawer: PropTypes.func.isRequired,
  onPlaybackStateChange: PropTypes.func.isRequired,
}

NavControls.defaultProps = {
  showSettingsDrawer: false,
}

const mapStateToProps = state => ({
  playbackState: state.controls.playbackState,
  showSettingsDrawer: state.controls.showSettingsDrawer,
})

const mapDispatchToProps = dispatch => ({
  onPlaybackStateChange: state => dispatch(setPlaybackState(state)),
  onShowSettingsDrawer: () => dispatch(showSettingsDrawer()),
  onHideSettingsDrawer: () => dispatch(hideSettingsDrawer()),
})

export default connect(mapStateToProps,mapDispatchToProps)(NavControls)
