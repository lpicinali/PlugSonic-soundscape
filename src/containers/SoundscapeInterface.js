import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ContainerDimensions from 'react-container-dimensions'
import styled from 'styled-components'
import { connect } from 'react-redux'

import ArrowControlsContainer from 'src/containers/ArrowControlsContainer'
import TabsContainer from 'src/containers/TabsContainer.js'
import ScaledSoundscape from 'src/containers/ScaledSoundscape.js'
import * as colors from 'src/styles/colors.js'
/* ========================================================================== */
const SoundscapeInterfaceContainer = styled.div`
  height: calc{100% - 48px};
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`
const SoundscapeArea = styled.div`
  flex-grow: 1;
`
const DrawersContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`
const SettingsDrawer = styled.div`
  width: 288px;
  flex-shrink: 1;
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: scroll;
  background: ${colors.WHITE};
  transition: width 0.5s;
  border: 1px solid ${colors.BLACK};
`
const ArrowsDrawer = styled.div`
  flex-shrink: 0;
  width: 288px;
  height: 140px;
  overflow: hidden;
  background: ${colors.WHITE};
  transition: width 0.5s;
  border: 1px solid ${colors.BLACK};
`
/* ========================================================================== */
/* SOUNDSCAPE INTERFACE */
/* ========================================================================== */
class SoundscapeInterface extends PureComponent {
  static propTypes = {
    showSettingsDrawer: PropTypes.bool.isRequired,
    showArrowsDrawer: PropTypes.bool.isRequired,
  }

  /* ------------------------------------------------------------------------ */
  render() {
    const { showSettingsDrawer, showArrowsDrawer } = this.props

    const showTouchArrowsDrawer = false

    return (
      <SoundscapeInterfaceContainer>
        <SoundscapeArea>
          <ContainerDimensions>
            {({ width, height, top, bottom, left, right }) => (
              <ScaledSoundscape size={{ width, height }} rect={{ top, bottom, left, right }}/>
            )}
          </ContainerDimensions>
        </SoundscapeArea>

        <DrawersContainer>
          {showSettingsDrawer === true && (
            <SettingsDrawer>
              <TabsContainer />
            </SettingsDrawer>
          )}

          {showArrowsDrawer === true && (
            <ArrowsDrawer>
              <ArrowControlsContainer/>
            </ArrowsDrawer>
          )}
        </DrawersContainer>
      </SoundscapeInterfaceContainer>
    )
  }
}

export default connect(state => ({
  showSettingsDrawer: state.controls.showSettingsDrawer,
  showArrowsDrawer: state.controls.showArrowsDrawer,
}))(SoundscapeInterface)
