import React, { PureComponent, Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ContainerDimensions from 'react-container-dimensions'

import NavControls from 'src/containers/NavControls'
import Soundscape from 'src/containers/Soundscape'
import { AppContainer, Nav } from 'src/containers/App.style'


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
