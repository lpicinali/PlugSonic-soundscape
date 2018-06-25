/* eslint react/prefer-stateless-function: 0 */
/* eslint react/forbid-prop-types: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import Button from 'src/components/Button.js'
import TargetVolumeSlider from 'src/components/TargetVolumeSlider.js'
import { StyledButtonGroup, StyledVolumeSlider } from 'src/components/ButtonSliderGroup.style.js'

/**
 * Button Slider Group
 */
class ButtonSliderGroup extends Component {
  static propTypes = {
    options: PropTypes.object.isRequired,
    enabledOptions: PropTypes.array.isRequired,
    value: PropTypes.array,
    isVertical: PropTypes.bool,
    onSelect: PropTypes.func.isRequired,
    onVolumeChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    value: [],
    isVertical: false,
  }

  render() {
    const {
      options,
      enabledOptions,
      value,
      isVertical,
      onSelect,
      onVolumeChange,
    } = this.props

    return (
      <StyledButtonGroup isVertical={isVertical}>
        {map(options, option => (
          <div key={option.id}>
            <Button
              isEnabled={enabledOptions.indexOf(option.id) >= 0}
              isActive={value.indexOf(option.id) >= 0}
              onClick={() => onSelect(option.id, option.url)}
            >
              {option.label}
            </Button>
            <StyledVolumeSlider>
              <TargetVolumeSlider
                id={option.id}
                volume={option.volume}
                onVolumeChange={onVolumeChange}
              />
            </StyledVolumeSlider>
          </div>
        ))}
      </StyledButtonGroup>
    )
  }
}

export default ButtonSliderGroup
