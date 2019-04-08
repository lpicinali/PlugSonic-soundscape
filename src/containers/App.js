import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { H4 } from 'src/styles/elements'
import { AppContainer, Nav } from 'src/containers/App.style'
import NavControls from 'src/containers/NavControls'
import SoundscapeInterface from 'src/containers/SoundscapeInterface'

import { importSources } from 'src/actions/sources.actions'
import { importListener } from 'src/actions/listener.actions'
import { importRoom } from 'src/actions/room.actions'
import { exhibitionMetadata } from 'src/pluggy'

class App extends Component {

  componentDidMount() {
    if (exhibitionMetadata.length !== 0){
      this.props.onImportSources(exhibitionMetadata.sources)
      this.props.onImportListener(exhibitionMetadata.listener)
      this.props.onImportRoom(exhibitionMetadata.room)
    }
  }

  render() {
    return (
      <AppContainer>
        <Nav>
          <NavControls />
        </Nav>

        <SoundscapeInterface />

        <H4>Tested on Google Chrome only.</H4>
      </AppContainer>
    )
  }
}

App.propTypes = {
  onImportSources: PropTypes.func.isRequired,
  onImportListener: PropTypes.func.isRequired,
  onImportRoom: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  onImportSources: sources => dispatch(importSources(sources)),
  onImportListener: listener => dispatch(importListener(listener)),
  onImportRoom: room => dispatch(importRoom(room)),
})

export default connect(null, mapDispatchToProps)(App)
