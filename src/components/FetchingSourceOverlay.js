import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { BLACK, GREY } from 'src/styles/colors.js'

const FetchingSourceOverlayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  background: ${BLACK};
  color: white;
  opacity: ${props => (props.isVisible ? 0.75 : 0)};
  pointer-events: ${props => (props.isVisible ? 'auto' : 'none')};
  transition: opacity 0.15s;
`

/**
 * Fetching Overlay
 */
class FetchingSourceOverlay extends PureComponent {
  static propTypes = {
    isFetchingSource: PropTypes.bool.isRequired,
  }

  render() {
    const { isFetchingSource } = this.props

    return (
      <FetchingSourceOverlayContainer isVisible={isFetchingSource}>
        Loading asset...
      </FetchingSourceOverlayContainer>
    )
  }
}

export default connect(state => ({
  isFetchingSource: state.sources.isFetchingSource,
}))(FetchingSourceOverlay)
