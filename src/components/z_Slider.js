import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { noop } from 'lodash'
import { autobind } from 'core-decorators'

/**
 * value Slider
 */
class Slider extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    min: 0,
    max: 10,
    step: null,
  }

  @autobind
  handleChange(evt) {
    const { value, step, onChange } = this.props

    const numericValue = parseFloat(evt.target.value)

    if (Math.abs(numericValue - value) >= step) {
      onChange(numericValue)
    }
  }

  render() {
    const { value, min, max, step } = this.props

    return (
      <div className="Slider">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          step={step !== null ? step : (max - min) / 100}
          onInput={this.handleChange}
          onChange={noop}
        />
      </div>
    )
  }
}

export default Slider
