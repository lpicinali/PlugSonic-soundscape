/* eslint react/prefer-stateless-function: 0 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyledArrowButton } from 'src/components/ArrowButton.style'
import { PlayIcon } from 'src/resources/icons/icons.js'
/**
 * ArrowButton
 */
class ArrowButton extends Component {
  static propTypes = {
    isEnabled     : PropTypes.bool,
    isActive      : PropTypes.bool,
    rotateIcon    : PropTypes.number,
    onClick       : PropTypes.func,
    onMouseEnter  : PropTypes.func,
    onMouseLeave  : PropTypes.func,
    onMouseDown   : PropTypes.func,
    onMouseUp     : PropTypes.func,
    onMouseOver   : PropTypes.func,
    onMouseOut    : PropTypes.func,
    onFocus       : PropTypes.func,
    onBlur        : PropTypes.func,
    className     : PropTypes.string,
    children      : PropTypes.node,
  }

  static defaultProps = {
    isEnabled     : true,
    isActive      : false,
    rotateIcon    : 0,
    className     : '',
    onClick       : () => {},
    onMouseEnter  : () => {},
    onMouseLeave  : () => {},
    onMouseDown   : () => {},
    onMouseUp     : () => {},
    onMouseOver   : () => {},
    onMouseOut    : () => {},
    onFocus       : () => {},
    onBlur        : () => {},
    children      : <PlayIcon />,
    }

  render() {
    const {
      isEnabled,
      isActive,
      rotateIcon,
      className,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      onMouseOver,
      onMouseOut,
      onFocus,
      onBlur,
      children
    } = this.props

    return (
      <StyledArrowButton
        isEnabled={isEnabled}
        isActive={isActive}
        rotateIcon={rotateIcon}
        className={className}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {children}
      </StyledArrowButton>
    )
  }
}

export default ArrowButton
