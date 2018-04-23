/* eslint react/prefer-stateless-function: 0 */
/* eslint react/forbid-prop-types: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import styled from 'styled-components'

import Button from 'src/components/Button.js'
import TargetVolumeSlider from 'src/components/TargetVolumeSlider.js'

// import { H3 } from 'src/styles/elements.js'

const StyledButtonGroup = styled.div`
  button {
    display: ${props => (props.isVertical ? 'block' : 'inline-block')};
    margin: 0 8px 8px 0;
  }
`

/**
 * Button Group
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

  // <StyledButtonGroup isVertical={isVertical}>
  //   {map(options, (optionLabel, optionValue) => (
  //     <div key={optionValue}>
  //       <Button
  //         isEnabled={enabledOptions.indexOf(optionValue) >= 0}
  //         isActive={value.indexOf(optionValue) >= 0}
  //         onClick={() => onSelect(optionValue)}
  //       >
  //         {optionLabel}
  //       </Button>
  //       <TargetVolumeSlider volume={volumes} onChange={onChange} />
  //     </div>
  //   ))}
  // </StyledButtonGroup>

  render() {
    const {
      options,
      enabledOptions,
      value,
      isVertical,
      onSelect,
      onVolumeChange,
    } = this.props

    // Each button:
    // key = file.filename
    // isEnabled = true
    // isActive = (file.filename === target.selected)
    // onClick = setTarget(file.filename)
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
            <TargetVolumeSlider
              id={option.id}
              volume={option.volume}
              onVolumeChange={onVolumeChange}
            />
          </div>
        ))}
      </StyledButtonGroup>
    )
  }
}

export default ButtonSliderGroup
