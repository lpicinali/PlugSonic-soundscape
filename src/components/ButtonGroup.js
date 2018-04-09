/* eslint react/prefer-stateless-function: 0 */
/* eslint react/forbid-prop-types: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import styled from 'styled-components'

import Button from 'src/components/Button.js'

const StyledButtonGroup = styled.div`
  button {
    display: ${props => (props.isVertical ? 'block' : 'inline-block')};
    margin: 0 8px 8px 0;
  }
`

/**
 * Button Group
 */
class ButtonGroup extends Component {
  static propTypes = {
    options: PropTypes.object.isRequired,
    enabledOptions: PropTypes.array.isRequired,
    value: PropTypes.array,
    isVertical: PropTypes.bool,
    onSelect: PropTypes.func.isRequired,
  }

  static defaultProps = {
    value: [],
    isVertical: false,
  }

  render() {
    const { options, enabledOptions, value, isVertical, onSelect } = this.props
    // Each button:
    // key = file.filename
    // isEnabled = true
    // isActive = (file.filename === target.selected)
    // onClick = setTarget(file.filename)
    return (
      <StyledButtonGroup isVertical={isVertical}>
        {map(options, (optionLabel, optionValue) => (
          <Button
            key={optionValue}
            isEnabled={enabledOptions.indexOf(optionValue) >= 0}
            isActive={value.indexOf(optionValue) >= 0}
            onClick={() => onSelect(optionValue)}
          >
            {optionLabel}
          </Button>
        ))}
      </StyledButtonGroup>
    )
  }
}

export default ButtonGroup
