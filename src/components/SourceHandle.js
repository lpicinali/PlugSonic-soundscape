import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { TURQOISE } from 'src/styles/colors.js'

const HandleWrapper = styled.div`
  position: relative;
  width: 6px;
  height: 6px;
  transform: translate3d(-50%, -50%, 0);
`

const Handle = styled.div`
  position: relative;
  z-index: 2;
  width: 200%;
  height: 200%;
  background: ${TURQOISE};
  border-radius: 100%;
  cursor: pointer;
  transform: translate3d(-25%, -25%, 0);
`

const Reach = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  width: ${props => props.reach * props.pixelsPerMeter.x}px;
  height: ${props => props.reach * props.pixelsPerMeter.z}px;
  background: ${props => props.isActive ? 'rgba(243, 36, 106, 0.1)' : '#e8e8eb'};
  border: 1px solid ${props => props.isActive ? '#f3246a' : 'transparent'};
  border-radius: 100%;
  transform: translate3d(-50%, -50%, 0);
`

/**
 * Source Handle
 */
class SourceHandle extends PureComponent {
  static propTypes = {
    reach: PropTypes.number.isRequired,
    pixelsPerMeter: PropTypes.shape({
      x: PropTypes.number.isRequired,
      z: PropTypes.number.isRequired,
    }).isRequired,
    isEditing: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
  }

  render() {
    const { reach, pixelsPerMeter, isEditing, onPress, ...props } = this.props

    return (
      <HandleWrapper {...props}>
        <Reach reach={reach} pixelsPerMeter={pixelsPerMeter} isActive={isEditing} />
        <Handle onMouseDown={onPress} />
      </HandleWrapper>
    )
  }
}

export default SourceHandle
