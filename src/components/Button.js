/* eslint react/prefer-stateless-function: 0 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { BLACK, TURQOISE, WHITE } from 'src/styles/colors.js'

const StyledButton = styled.button`
  appearance: none;
  padding: 4px 8px;
  margin-right: 8px;
  background: ${WHITE};
  border: 1px solid ${TURQOISE};
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  color: ${BLACK};
  font-size: 16px;
  transition: all 0.15s;

  &:hover {
    box-shadow: 0 0 0 3px ${TURQOISE};
  }

  ${props =>
    props.isActive
      ? `
    background-color: ${TURQOISE};
    color: ${WHITE};
  `
      : ``} ${props =>
      props.disabled
        ? `
    border-color: gray;
    color: gray;
    pointer-events: none;
  `
        : ``};
`

/**
 * Button
 */
class Button extends Component {
  static propTypes = {
    isEnabled: PropTypes.bool,
    isActive: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {
    isEnabled: true,
    isActive: false,
    className: '',
  }
  // Button:
  // disables = html property for enabled buttons
  // onClick = onSelect = setTarget(targets.selected)
  // isActive = boolean passed from ButtonGroup
  render() {
    const { isEnabled, isActive, onClick, className, children } = this.props

    return (
      <StyledButton
        disabled={isEnabled === false}
        className={className}
        onClick={onClick}
        isActive={isActive}
      >
        {children}
      </StyledButton>
    )
  }
}

export default Button
