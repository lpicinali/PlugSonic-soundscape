/* eslint no-unused-vars: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint react/prefer-stateless-function: 0 */
/* eslint no-lonely-if: 0 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import * as colors from 'src/styles/colors'
// ===================================================================== //
const drawerWidth = 240
const roomRatio = 2
const showRight = 1
// ===================================================================== //
const SoundscapeContainer = styled.div`
  background: ${colors.YELLOW};
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  margin-left: auto;
  margin-right: auto;
`

const Drawer = styled.div`
  background: ${colors.GREEN};
  flex-shrink: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  transition: width 1s;
  width: ${props => props.width}px;
`

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`
// ======================= _SOUNDSCAPE_ ================================ //
class Soundscape extends Component {
  render() {
    const { width, height } = this.props

    const newDrawerWidth = showRight ? drawerWidth : 0
    const containerWidth = width - newDrawerWidth
    const containerRatio = containerWidth/height

    let newWidth = 0;
    let newHeight = 0;
    if (roomRatio >= containerRatio) {
      newWidth = containerWidth
      newHeight = containerWidth * 1/roomRatio
    } else {
      newWidth = height * roomRatio
      newHeight = height
    }

    return (
      <Container>
        <SoundscapeContainer width={newWidth} height={newHeight}>
          Soundscape Container
        </SoundscapeContainer>
        <Drawer width={newDrawerWidth}>
          Right Drawer
        </Drawer>
      </Container>
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
