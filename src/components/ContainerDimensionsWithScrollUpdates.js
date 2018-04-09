import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ContainerDimensions from 'react-container-dimensions'

import * as CustomPropTypes from 'src/prop-types.js'

/**
 * Container Dimensions With Scroll Updates
 */
class ContainerDimensionsWithScrollUpdates extends Component {
  static propTypes = {
    scrollTarget: CustomPropTypes.scrollable.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.node,
      PropTypes.func,
    ]).isRequired,
  }

  //  $el = null

  constructor(props) {
    super(props)
    this.storeRef = this.storeRef.bind(this)
    this.state = {
      top: 0,
      left: 0,
    }
  }

  componentDidMount() {
    const { scrollTarget } = this.props

    scrollTarget.addEventListener('scroll', () => {
      this.setState(
        {
          top: scrollTarget.scrollTop || scrollTarget.scrollY,
          left: scrollTarget.scrollLeft || scrollTarget.scrollX,
        },
        () => {
          this.$el.onResize()
        }
      )
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.top !== this.state.top ||
      nextState.left !== this.state.left
    ) {
      this.$el.onResize()
    }

    return true
  }

  $el = null

  storeRef($el) {
    this.$el = $el
  }

  render() {
    const { children } = this.props

    return React.createElement(
      ContainerDimensions,
      { ref: this.storeRef },
      children
    )
  }
}

export default ContainerDimensionsWithScrollUpdates
