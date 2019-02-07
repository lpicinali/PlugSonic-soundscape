import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import * as colors from 'src/styles/colors'
import { values } from 'lodash'

import Toggle from 'material-ui/Toggle'
import { setHighPerformanceMode, setHighQualityMode } from 'src/actions/listener.actions'
import { SpatializationMode } from 'src/constants'
/* ========================================================================== */
const toggleStyle = {
  margin: `auto`,
  marginTop: `20px`,
  width: `85%`,
}

const toggleLabelStyle = {
  fontSize: `14px`,
  textTransform: `uppercase`,
  letterSpacing: `1px`,
}
/* ========================================================================== */
/* SPATIALIZATION MODE TOGGLE */
/* ========================================================================== */
class SpatializationModeToggle extends PureComponent {

  toggleSpatializationMode = () => {
    this.props.spatializationMode === SpatializationMode.HighQuality ?
      this.props.onSetHighPerformanceMode()
        :
      this.props.onSetHighQualityMode()
  }

  render() {

    return (
      <Toggle
        label="Performance Mode"
        style={toggleStyle}
        labelStyle={toggleLabelStyle}
        onToggle={this.toggleSpatializationMode}
      />
    )
  }
}

SpatializationModeToggle.propTypes = {
  spatializationMode: PropTypes.oneOf(values(SpatializationMode)).isRequired,
  onSetHighPerformanceMode: PropTypes.func.isRequired,
  onSetHighQualityMode: PropTypes.func.isRequired,
}

SpatializationModeToggle.defaultProps = {
  spatializationMode: SpatializationMode.HighQuality,
}

const mapStateToProps = state => ({
  spatializationMode: state.listener.spatializationMode,
})

const mapDispatchToProps = dispatch => ({
  onSetHighPerformanceMode: () => dispatch(setHighPerformanceMode()),
  onSetHighQualityMode: () => dispatch(setHighQualityMode()),
})

export default connect(mapStateToProps,mapDispatchToProps)(SpatializationModeToggle)
