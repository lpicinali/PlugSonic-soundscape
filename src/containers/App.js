import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { H4 } from 'src/styles/elements'
import { AppContainer, Nav } from 'src/containers/App.style'
import NavControls from 'src/containers/NavControls'
import SoundscapeInterface from 'src/containers/SoundscapeInterface'

import { exhibition } from 'src/pluggy'
import { importExhibition } from 'src/actions/exhibition.actions.js'
import { importListener } from 'src/actions/listener.actions.js'
import { importRoom } from 'src/actions/room.actions.js'
import { importSources } from 'src/actions/sources.actions.js'

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
    isDisclaimerOpen: true,
  }
  componentDidMount() {
    if (
      Object.keys(exhibition).length !== 0 &&
      exhibition.constructor === Object
    ) {
      if (
        exhibition.description &&
        exhibition.id &&
        exhibition.ownerId &&
        exhibition.tags &&
        exhibition.title &&
        (exhibition.isPublished === true || exhibition.isPublished === false)
      ) {
        this.props.onImportExhibition(
          exhibition.description,
          exhibition.id,
          exhibition.ownerId,
          exhibition.tags,
          exhibition.title,
          exhibition.isPublished
        )
      }

      if (exhibition.metadata.listener) {
        this.props.onImportListener(exhibition.metadata.listener)
      }

      if (exhibition.metadata.room) {
        this.props.onImportRoom(exhibition.metadata.room)
      }

      if (exhibition.metadata.sources) {
        this.props.onImportSources(exhibition.metadata.sources)
      }
    }
  }

  render() {
    return (
      <AppContainer>
        {/* <Dialog open={this.state.isDisclaimerOpen}>
          <DialogTitle>Disclaimer</DialogTitle>

          <DialogContent>
            <DialogContentText>
          WARNING: This application might result in very loud audio levels,
          which can cause damage to your hearing, especially if you are
          wearing headphones. Please ensure you take caution and keep your
          headphones volume low.
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
  onImportExhibition: PropTypes.func.isRequired,
  onImportListener: PropTypes.func.isRequired,
  onImportRoom: PropTypes.func.isRequired,
  onImportSources: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  onImportListener: listener => dispatch(importListener(listener)),
  onImportRoom: room => dispatch(importRoom(room)),
  onImportSources: sources => dispatch(importSources(sources)),
  onImportExhibition: (description, id, ownerId, tags, title, isPublished) =>
    dispatch(
      importExhibition(description, id, ownerId, tags, title, isPublished)
    ),
})

export default connect(
  null,
  mapDispatchToProps
)(App)
