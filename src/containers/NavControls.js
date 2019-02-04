import React, { Component} from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'
import * as colors from 'src/styles/colors'

import FlatButton from "material-ui/FlatButton"
import SettingsIcon from "material-ui/svg-icons/action/settings"
import ArrowIcon from "material-ui/svg-icons/navigation/chevron-right"

import { showSettingsDrawer, hideSettingsDrawer } from 'src/actions/controls.actions'
/* ========================================================================== */
const FlatButtonStyle = {
  minWidth: '48px',
  minHeight: '48px',
  padding: '0px 0px',
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
      <FlatButton icon={DrawerIcon} style={FlatButtonStyle} onClick={this.toggleSettings}/>
    )
  }
}

NavControls.propTypes = {
  showSettingsDrawer: PropTypes.bool.isRequired,
  onShowSettingsDrawer: PropTypes.func.isRequired,
  onHideSettingsDrawer: PropTypes.func.isRequired,
}

NavControls.defaultProps = {
  showSettingsDrawer: false,
}

const mapStateToProps = state => ({
  showSettingsDrawer: state.controls.showSettingsDrawer,
})

const mapDispatchToProps = dispatch => ({
  onShowSettingsDrawer: () => dispatch(showSettingsDrawer()),
  onHideSettingsDrawer: () => dispatch(hideSettingsDrawer()),
})

export default connect(mapStateToProps,mapDispatchToProps)(NavControls)
