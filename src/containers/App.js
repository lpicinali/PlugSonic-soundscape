import React, { PureComponent, Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { H4 } from 'src/styles/elements'
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

        <H4>Developed and tested on Google Chrome only.</H4>
      </AppContainer>
    )
  }
}

export default App
