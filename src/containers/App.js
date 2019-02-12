import React, { PureComponent, Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { AppContainer, Nav } from 'src/containers/App.style'
import NavControls from 'src/containers/NavControls'
import SoundscapeInterface from 'src/containers/SoundscapeInterface'

class App extends Component {
  render() {
    return (
      <AppContainer>
        <Nav>
          <NavControls />
        </Nav>

        <SoundscapeInterface />
      </AppContainer>
    )
  }
}

export default App
