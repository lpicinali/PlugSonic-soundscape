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

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'

class App extends Component {

  state = {
    isDisclaimerOpen: true
  }
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
        {/* <Dialog
          open={this.state.isDisclaimerOpen}
          >
          <DialogTitle>Disclaimer</DialogTitle>

          <DialogContent>
            <DialogContentText>
          WARNING: This application might result in very loud audio levels,
          which can cause damage to your hearing, especially if you are wearing headphones.
          Please ensure you take caution and keep your headphones volume low.
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
          variant="contained"
          color="primary"
          onClick={() => this.setState({ isDisclaimerOpen: false })}
            >
          Understood
            </Button>
          </DialogActions>
        </Dialog> */}

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
