import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ContainerDimensions from 'react-container-dimensions'
import styled from 'styled-components'
import { connect } from 'react-redux'

import TabsContainer from 'src/containers/TabsContainer.js'
import ScaledSoundscape from 'src/containers/ScaledSoundscape.js'
import * as colors from 'src/styles/colors.js'
/* ========================================================================== */
const SoundscapeInterfaceContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`
const SoundscapeArea = styled.div`
  flex-grow: 1;
`
const Drawer = styled.div`
  flex-basis: 288px;
  flex-shrink: 0;
  width: 288px;
  overflow-x: hidden;
  overflow-y: scroll;
  background: ${colors.WHITE};
  transition: width 0.5s;
`
/* ========================================================================== */
/* SOUNDSCAPE INTERFACE */
/* ========================================================================== */
class SoundscapeInterface extends PureComponent {
  static propTypes = {
    showSettingsDrawer: PropTypes.bool.isRequired,
  }

  /* ------------------------------------------------------------------------ */
  render() {
    const { showSettingsDrawer } = this.props

    return (
      <SoundscapeInterfaceContainer>
        <SoundscapeArea>
          <ContainerDimensions>
            {({ width, height, top, bottom, left, right }) => (
              <ScaledSoundscape size={{ width, height }} rect={{ top, bottom, left, right }}/>
            )}
          </ContainerDimensions>
        </SoundscapeArea>

        {showSettingsDrawer === true && (
          <Drawer>
            <TabsContainer />
          </Drawer>
        )}
      </SoundscapeInterfaceContainer>
    )
  }
}

export default connect(state => ({
  showSettingsDrawer: state.controls.showSettingsDrawer,
}))(SoundscapeInterface)
