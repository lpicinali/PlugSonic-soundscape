import { connect } from 'react-redux'
import FileReaderInput from 'react-file-reader-input'
import PropTypes from 'prop-types'
import React, { Fragment, Component } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'

import { setPlaybackState } from 'src/actions/controls.actions.js'
// import { importSoundscapeCompleted } from 'src/actions/dialogs.actions.js'
import { importListener } from 'src/actions/listener.actions.js'
import { importRoom } from 'src/actions/room.actions.js'
import { importSources } from 'src/actions/sources.actions.js'
import { PlaybackState } from 'src/constants.js'

/* ========================================================================== */
/* IMPORT BUTTON */
/* ========================================================================== */
class ImportButton extends Component {
  state = {
    soundscapeToImport: {},
    isImportDialogOpen: false,
  }

  handleImportSoundscape = (evt, results) => {
    results.forEach(result => {
      const [e, file] = result
      const soundscape = JSON.parse(e.target.result)
      this.setState({soundscapeToImport: soundscape, isImportDialogOpen: true})
    })
  }

  handleImportSoundscapeResponse = (confirm) => {
    if (confirm) {
      const soundscape = this.state.soundscapeToImport
      this.props.onSetPlaybackState(PlaybackState.STOP)
      this.props.onImportSources(soundscape.sources)
      this.props.onImportListener(soundscape.listener)
      this.props.onImportRoom(soundscape.room)
    }
    this.setState({soundscapeToImport: {}, isImportDialogOpen: false})
  }

  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <Fragment>
        <Button variant="contained" color="primary" fullWidth>
          <FileReaderInput
            type="file"
            accept=".json"
            as="binary"
            onChange={this.handleImportSoundscape}
          >
            METADATA/META+ASSETS
          </FileReaderInput>
        </Button>

        <Dialog
          open={this.state.isImportDialogOpen}
          onClose={() => this.handleImportSoundscapeResponse(false)}
        >
          <DialogTitle>Import Soundscape</DialogTitle>

          <DialogContent>
            <DialogContentText>
              This action will require some time. Please wait few seconds before playing the soundscape. Press OK to continue...
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => this.handleImportSoundscapeResponse(false)}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => this.handleImportSoundscapeResponse(true)}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* <Dialog
          open={this.props.importSoundscapeCompleted}
          >
          <DialogTitle>Import Soundscape</DialogTitle>

          <DialogContent>
            <DialogContentText>
          Import soundscape completed!
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
          variant="contained"
          color="primary"
          onClick={() => this.onImportSoundscapeCompleted(false)}
            >
          OK
            </Button>
          </DialogActions>
        </Dialog> */}
      </Fragment>
    )
  }
}

ImportButton.propTypes = {
  // importSoundscapeCompleted: PropTypes.bool.isRequired,
  onImportListener: PropTypes.func.isRequired,
  onImportRoom: PropTypes.func.isRequired,
  // onImportSoundscapeCompleted: PropTypes.func.isRequired,
  onImportSources: PropTypes.func.isRequired,
  onSetPlaybackState: PropTypes.func.isRequired,
}

// const mapStateToProps = state => ({
//   importSoundscapeCompleted: state.dialogs.importSoundscapeCompleted,
// })

const mapDispatchToProps = dispatch => ({
  onImportListener: listener => dispatch(importListener(listener)),
  onImportRoom: room => dispatch(importRoom(room)),
  // onImportSoundscapeCompleted: completed => dispatch(importSoundscapeCompleted(completed)),
  onImportSources: sources => dispatch(importSources(sources)),
  onSetPlaybackState: state => dispatch(setPlaybackState(state)),
})

export default connect(
  // mapStateToProps,
  null,
  mapDispatchToProps
)(ImportButton)
