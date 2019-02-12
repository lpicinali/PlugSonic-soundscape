import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ContainerDimensions from 'react-container-dimensions'
import styled from 'styled-components'

import TabsContainer from 'src/containers/TabsContainer.js'
import ScaledSoundscape from 'src/containers/ScaledSoundscape.js'
import * as colors from 'src/styles/colors.js'

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
  background: ${colors.GREEN};
  transition: width 0.5s;
`

/**
 * Soundscape Interface
 */
class SoundscapeInterface extends PureComponent {
  render() {
    return (
      <SoundscapeInterfaceContainer>
        <SoundscapeArea>
          <ContainerDimensions>
            {({ width, height }) => (
              <ScaledSoundscape size={{ width, height }} />
            )}
          </ContainerDimensions>
        </SoundscapeArea>

        <Drawer>
          <TabsContainer />
        </Drawer>
      </SoundscapeInterfaceContainer>
    )
  }
}

export default SoundscapeInterface
