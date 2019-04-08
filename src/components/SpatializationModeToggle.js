import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { values } from 'lodash'
import { FormControlLabel, FormGroup, Switch } from '@material-ui/core'

import { SpatializationMode } from 'src/constants.js'
import {
  setHighPerformanceMode,
  setHighQualityMode,
} from 'src/actions/listener.actions.js'

/* ========================================================================== */
/* SPATIALIZATION MODE TOGGLE */
/* ========================================================================== */
class SpatializationModeToggle extends PureComponent {
  toggleSpatializationMode = () => {
    if (this.props.spatializationMode === SpatializationMode.HighQuality) {
      this.props.onSetHighPerformanceMode()
    } else {
      this.props.onSetHighQualityMode()
    }
  }

  render() {
    return (
      <FormGroup row>
        <FormControlLabel
          label="Performance Mode"
          labelPlacement="start"
          control={
            <Switch
              onChange={this.toggleSpatializationMode}
              checked={
                this.props.spatializationMode ===
                SpatializationMode.HighPerformance
              }
            />
          }
        />
      </FormGroup>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpatializationModeToggle)
