import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { fromGain, toGain } from 'decibels'

import Slider from 'src/components/Slider.js'

/**
 * Volume Slider
 */
class TargetVolumeSlider extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    volume: PropTypes.number.isRequired,
    onVolumeChange: PropTypes.func.isRequired,
  }

  @autobind
  handleSliderChange(value) {
    // console.log('TARGET VOLUME SLIDER');
    // console.log(this.props.id, toGain(value))
    this.props.onVolumeChange(this.props.id, toGain(value))
  }

  render() {

    const { volume } = this.props

    // console.log('ID');
    // console.log(id);

    return (
      <Slider
        value={fromGain(volume)}
        min={-40}
        max={20}
        step={1}
        onChange={this.handleSliderChange}
      />
    )
  }
}

export default TargetVolumeSlider
