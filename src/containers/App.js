import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { H4 } from 'src/styles/elements'
import { AppContainer, Nav } from 'src/containers/App.style'
import FetchingSourceOverlay from 'src/components/FetchingSourceOverlay.js'
import NavControls from 'src/containers/NavControls'
import SoundscapeInterface from 'src/containers/SoundscapeInterface'
import WindowClosePrompt from 'src/containers/WindowClosePrompt.js'

import { API, exhibition, httpGetAsync } from 'src/pluggy'
import {
  importExhibition,
  setCoverLegal,
} from 'src/actions/exhibition.actions.js'
import { importListener } from 'src/actions/listener.actions.js'
import { importRoom, setRoomImage } from 'src/actions/room.actions.js'
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
    console.log('APP')
    console.log('componentDidMount')
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

      if (exhibition.arrayMetadata !== []) {
        // convert metadata from array of objects to object
        const objectMetadata = {}
        for (let i = 0; i < exhibition.arrayMetadata.length; i++) {
          if (exhibition.arrayMetadata[i]) {
            objectMetadata[
              Object.keys(exhibition.arrayMetadata[i])[0]
            ] = Object.values(exhibition.arrayMetadata[i])[0]
          }
        }

        if (objectMetadata.coverLegal) {
          this.props.onSetCoverLegal(objectMetadata.coverLegal)
        }

        if (objectMetadata.soundscape) {
          if (objectMetadata.soundscape.listener) {
            this.props.onImportListener(objectMetadata.soundscape.listener)
          }

          if (objectMetadata.soundscape.room) {
            this.props.onImportRoom(objectMetadata.soundscape.room)

            if (
              objectMetadata.soundscape.room.backgroundImage.assetId &&
              objectMetadata.soundscape.room.backgroundImage.mediaId
            ) {
              const backgroundImageAssetId =
                objectMetadata.soundscape.room.backgroundImage.assetId
              const backgroundImageMediaId =
                objectMetadata.soundscape.room.backgroundImage.mediaId

              const imageUrl = `${API}/assets/${backgroundImageAssetId}/media/${backgroundImageMediaId}`

              httpGetAsync(
                imageUrl,
                this.getImageAssetCallback,
                null,
                null,
                'blob'
              )
            }
          }

          if (objectMetadata.soundscape.sources) {
            this.props.onImportSources(objectMetadata.soundscape.sources)
          }
        }
      }
    }
  }

  getImageAssetCallback = response => {
    const reader = new FileReader()
    reader.readAsDataURL(response)

    reader.onload = () => {
      this.props.onRoomImageChange({
        // assetId: this.props.exhibition.assetId,
        assetId: this.state.backgroundImageAssetId,
        // mediaId: this.props.exhibition.mediaId,
        mediaId: this.state.backgroundImageMediaId,
        raw: reader.result,
      })
    }
  }

  render() {
    return (
      <AppContainer>
        <Dialog open={this.state.isDisclaimerOpen}>
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
        </Dialog>

        <Nav>
          <NavControls />
        </Nav>

        <SoundscapeInterface />

        <H4>Tested on Google Chrome only.</H4>

        <FetchingSourceOverlay />
        <WindowClosePrompt />
      </AppContainer>
    )
  }
}

App.propTypes = {
  exhibition: PropTypes.object.isRequired,
  onImportExhibition: PropTypes.func.isRequired,
  onImportListener: PropTypes.func.isRequired,
  onImportRoom: PropTypes.func.isRequired,
  onImportSources: PropTypes.func.isRequired,
  onRoomImageChange: PropTypes.func.isRequired,
  onSetCoverLegal: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  exhibition: state.exhibition,
})

const mapDispatchToProps = dispatch => ({
  onImportListener: listener => dispatch(importListener(listener)),
  onImportRoom: room => dispatch(importRoom(room)),
  onImportSources: sources => dispatch(importSources(sources)),
  onImportExhibition: (description, id, ownerId, tags, title, isPublished) =>
    dispatch(
      importExhibition(description, id, ownerId, tags, title, isPublished)
    ),
  onRoomImageChange: image => dispatch(setRoomImage(image)),
  onSetCoverLegal: license => dispatch(setCoverLegal(license)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
