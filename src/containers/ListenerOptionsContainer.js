/* eslint react/prefer-stateless-function: 0 */
/* eslint react/forbid-prop-types: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Toggle from 'material-ui/Toggle'

import { circumferenceToRadius, radiusToCircumference } from 'src/utils.js'
import { setHeadRadius, setPerformanceMode, } from 'src/actions/listener.actions.js'
import Slider from 'src/components/Slider.js'
import { H2, H3 } from 'src/styles/elements.js'
import styles from 'src/containers/ListenerOptionsContainer.style'

/**
 * Listener Options Container
 */
class ListenerOptionsContainer extends Component {
  static propTypes = {
    isPerformanceModeEnabled: PropTypes.bool.isRequired,
    headRadius: PropTypes.number.isRequired,
    onChangePerformanceMode: PropTypes.func.isRequired,
    onChangeHeadRadius: PropTypes.func.isRequired,
  }

  render() {
    const {
      isPerformanceModeEnabled,
      headRadius,
      onChangePerformanceMode,
      onChangeHeadRadius,
    } = this.props

    return (
      <div>
        <H2>Listener</H2>

        <div style={{ width: `60%` }}>
          <Toggle
            label="Performance Mode"
            style={styles.toggle}
            labelStyle={styles.label}
            onToggle={() => onChangePerformanceMode(!isPerformanceModeEnabled)} />
        </div>

          <H3 style= {{ marginTop: `50px` }}>
            {`Head circumference: ${Math.round(100 * radiusToCircumference(headRadius))} cm`}
          </H3>

          <div style = {{ width: `60%` }}>
            <Slider
              value={radiusToCircumference(headRadius)}
              min={0.4}
              max={0.7}
              step={0.005}
              onChange={circumference => onChangeHeadRadius(circumferenceToRadius(circumference))}
            />
          </div>

      </div>
    )
  }
}

export default connect(
  state => ({
    isPerformanceModeEnabled: state.listener.isPerformanceModeEnabled,
    headRadius: state.listener.headRadius,
  }),
  dispatch => ({
    onChangePerformanceMode: isEnabled =>
      dispatch(setPerformanceMode(isEnabled)),
    onChangeHeadRadius: radius => dispatch(setHeadRadius(radius)),
  })
)(ListenerOptionsContainer)
