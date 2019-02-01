import React, { PureComponent, Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ContainerDimensions from 'react-container-dimensions'

import { AppContainer, Nav } from 'src/containers/App.style'
import NavControls from 'src/containers/NavControls'
import Soundscape from 'src/containers/Soundscape'


class App extends Component {
  render() {
    return (
          <AppContainer>
            <Nav>
              <NavControls/>
            </Nav>
            <ContainerDimensions>
              <Soundscape/>
            </ContainerDimensions>
          </AppContainer>
    )
  }
}

export default App
