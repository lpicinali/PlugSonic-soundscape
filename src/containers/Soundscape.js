/* eslint no-unused-vars: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint react/prefer-stateless-function: 0 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import * as colors from 'src/styles/colors'

// ======================= _SOUNDSCAPE_ ================================ //
const SoundscapeContainer = styled.div`
  background: ${colors.YELLOW};
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`

class Soundscape extends Component {
  render() {
    const { width, height } = this.props

    const roomRatio = 1.5
    const containerRatio = width/height

    let newWidth = 0;
    let newHeight = 0;
    if (roomRatio >= containerRatio) {
      newWidth = width
      newHeight = width * 1/roomRatio
    } else {
      newWidth = height * roomRatio
      newHeight = height
    }

    // Add Right Drawer and ricalculate newWidth and newHeight considering Drawer open/closed

    return (
      <SoundscapeContainer width={newWidth} height={newHeight}>
        {/* Map Component with width and height 100% with sources places with relative coordinates (in percentage wrt room size in metres) */}
      </SoundscapeContainer>
    )
  }
}

Soundscape.defaultProps = {
  width: 0,
  height: 0,
}

Soundscape.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
}

export default Soundscape

















// class Soundscape extends Component {
//   render() {
//     const { width, height } = this.props
//
//     const roomRatio = 5
//     const containerRatio = width/height
//
//     let newWidth = 0;
//     let newHeight = 0;
//     if (roomRatio >= containerRatio) {
//       newWidth = width
//       newHeight = width * 1/roomRatio
//     } else {
//       newWidth = height * roomRatio
//       newHeight = height
//     }
//
//     return (
//       <div id='SoundscapeContainer'
//         style={{
//           background: `${colors.YELLOW}`,
//           display: 'flex',
//           flexDirection: 'row',
//           boxSizing: `borderBox`,
//           width: `${newWidth}px`,
//           height: `${newHeight}px`
//         }}
//       />
//     )
//   }
// }
//
// Soundscape.defaultProps = {
//   width: 0,
//   height: 0,
// }
//
// Soundscape.propTypes = {
//   width: PropTypes.number,
//   height: PropTypes.number,
// }
//
// export default Soundscape
