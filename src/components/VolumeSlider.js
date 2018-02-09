import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { fromGain, toGain } from 'decibels'

import Slider from 'src/components/Slider.js'

/**
 * Volume Slider
 */
class VolumeSlider extends PureComponent {
  static propTypes = {
    volume: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  @autobind
  handleSliderChange(value) {
    this.props.onChange(toGain(value))
  }

  render() {
    const { volume } = this.props

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

export default VolumeSlider
