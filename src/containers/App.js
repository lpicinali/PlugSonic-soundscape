import React, { PureComponent, Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ContainerDimensions from 'react-container-dimensions'

import { AppContainer, Nav } from 'src/containers/App.style'
import NavControls from 'src/containers/NavControls'
import ScaledSoundscape from 'src/containers/ScaledSoundscape'

class App extends Component {
  render() {
    return (
      <AppContainer>
        <Nav>
          <NavControls />
        </Nav>
        <ContainerDimensions>
          <ScaledSoundscape />
        </ContainerDimensions>
      </AppContainer>
    )
  }
}

export default App
