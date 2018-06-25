/* eslint react/prefer-stateless-function: 0 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import StyledButton from 'src/components/Button.style.js'
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
