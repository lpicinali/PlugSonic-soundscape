/* eslint react/prefer-stateless-function: 0 */
/* eslint react/forbid-prop-types: 0 */

/* ------------------- NOTES -------------------- *//*

*//* ---------------------------------------------- */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { reduce } from 'lodash'

// import { circumferenceToRadius, radiusToCircumference } from 'src/utils.js'
import {
  // setHeadRadius,
  // setPerformanceMode,
  setMasterVolume,
} from 'src/actions/controls.actions.js'
import { setTarget,
  // setTargetVolume
} from 'src/actions/target.actions.js'
import {
  // setHeadRadius,
  // setPerformanceMode,
} from 'src/actions/listener.actions.js'
// import DirectionalityContainer from 'src/containers/DirectionalityContainer.js'
// import ButtonGroup from 'src/components/ButtonGroup.js'
import ButtonSliderGroup from 'src/components/ButtonSliderGroup.js'
// import Slider from 'src/components/Slider.js'
import MasterVolumeSlider from 'src/components/MasterVolumeSlider.js'
import { H2, H3 } from 'src/styles/elements.js'

/**
 * Target Selector Container
 */
class TargetSelectorContainer extends Component {
  static propTypes = {
    targets: PropTypes.object.isRequired,
    selected: PropTypes.array,
    masterVolume: PropTypes.number.isRequired,
    // isPerformanceModeEnabled: PropTypes.bool.isRequired,
    // headRadius: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    // onChangeTargetVolume: PropTypes.func.isRequired,
    onChangeMasterVolume: PropTypes.func.isRequired,
    // onChangePerformanceMode: PropTypes.func.isRequired,
    // onChangeHeadRadius: PropTypes.func.isRequired,
  }

  static defaultProps = {
    selected: [],
  }

  render() {
    const {
      targets,
      selected,
      masterVolume,
      // isPerformanceModeEnabled,
      // headRadius,
      onSelect,
      // onChangeTargetVolume,
      onChangeMasterVolume,
      // onChangePerformanceMode,
      // onChangeHeadRadius,
    } = this.props;

    const options = reduce(
      targets,
      (aggr, file) => ({
        ...aggr,
        [file.filename]: file.title,
      }),
      {}
    );

    // const volumes = reduce(
    //   targets,
    //   (aggr, file) => ({
    //     ...aggr,
    //     [file.filename]: file.volume,
    //   }),
    //   {}
    // );

    // const volumes = reduce(
    //   targets,
    //   (aggr, file) => ({
    //     ...aggr,
    //     [file.filename]: file.volume,
    //   }),
    //   {}
    // );

    // List of buttons
    // options = { file#0.filename: file#0.title#0 ... file#N.filename: file#N.title }
    // enabledOption = [ file#0.filename , ... , file#N.filename ]
    // value = targets.selected
    // isVertical = true
    // onSelect = setTarget(targets.selected)


    // onChange={(id, volume) => onChangeTargetVolume(id, volume)}
    return (
      <div>
        <H2>Soundscape</H2>

        <div>
          <H3>Sources</H3>
          <ButtonSliderGroup
            options={options}
            enabledOptions={Object.keys(options)}
            value={selected}
            isVertical
            onSelect={onSelect}
            volumes={masterVolume}
            onChange={onChangeMasterVolume}
          />
        </div>

        <div style={{ display: 'flex' }}>
          <div style={{ paddingRight: 16 }}>
            <H3>Master Volume</H3>
            <MasterVolumeSlider volume={masterVolume} onChange={onChangeMasterVolume} />
          </div>
        </div>

      </div>
    )
  }
}

export default connect(
  state => ({
    targets: state.target.targets,
    selected: state.target.selected,
    masterVolume: state.controls.masterVolume,
    // isPerformanceModeEnabled: state.controls.isPerformanceModeEnabled,
    // headRadius: state.controls.headRadius,
  }),
  dispatch => ({
    onSelect: target => dispatch(setTarget(target)),
    // onChangeTargetVolume: (id, volume) => dispatch(setTargetVolume(id, volume)),
    onChangeMasterVolume: volume => dispatch(setMasterVolume(volume)),
    // onChangePerformanceMode: isEnabled =>
    //   dispatch(setPerformanceMode(isEnabled)),
    // onChangeHeadRadius: radius => dispatch(setHeadRadius(radius)),
  })
)(TargetSelectorContainer)
