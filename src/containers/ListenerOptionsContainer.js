/* eslint no-unused-expressions: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint no-unused-vars: 0 */
/* eslint react/forbid-prop-types: 0 */
/* global location */
/* eslint no-restricted-globals: 0 */
/* eslint react/prefer-stateless-functions: 0 */
/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Toggle from 'material-ui/Toggle'

import { circumferenceToRadius, radiusToCircumference } from 'src/utils.js'
import { setHeadRadius, setPerformanceMode, } from 'src/actions/listener.actions.js'
import Slider from 'src/components/Slider.js'
import { H2, H3 } from 'src/styles/elements.js'
import {
  styles,
  ContainerDiv,
  HeadCircContainerDiv,
  toggleStyle,
  toggleLabelStyle,
} from 'src/containers/ListenerOptionsContainer.style'

/**
 * Listener Options Container
 */
class ListenerOptionsContainer extends PureComponent {
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
      <ContainerDiv>
        <H2>Listener</H2>

        <Toggle
          label="Performance Mode"
          style={toggleStyle}
          labelStyle={toggleLabelStyle}
          onToggle={() => onChangePerformanceMode(!isPerformanceModeEnabled)}
        />

        <HeadCircContainerDiv>
          <H3 style= {{ marginTop: `3px` }}>
            {`Head circumference: ${Math.round(100 * radiusToCircumference(headRadius))} cm`}
          </H3>

          <div style = {{ width: `25%` }}>
            <Slider
              value={radiusToCircumference(headRadius)}
              min={0.4}
              max={0.7}
              step={0.005}
              onChange={circumference => onChangeHeadRadius(circumferenceToRadius(circumference))}
            />
          </div>
        </HeadCircContainerDiv>

      </ContainerDiv>
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
