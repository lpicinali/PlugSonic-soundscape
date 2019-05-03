import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
import Blob from 'blob'
import { map } from 'lodash'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'

/* ========================================================================== */
/* EXPORT META BUTTON */
/* ========================================================================== */
class ExportMetaButton extends Component {
  state = {
    isExportDialogOpen: false,
  }

  handleExportMetaResponse = (confirm) => {
    if (confirm) {
      try {
        const isFileSaverSupported = !!new Blob()
      } catch (e) {
        console.log('The File APIs are not fully supported in this browser.')
      }

      const soundscape = {
        sources: this.props.sources,
        listener: this.props.listener,
        room: this.props.room,
      }

      const clone = JSON.parse(JSON.stringify(soundscape))
      clone.sources = map(clone.sources, source => {
        source.raw = null
        return source
      })

      const json = JSON.stringify(clone, null, 2)

      const blob = new File([json], { type: 'application/json' })
      FileSaver.saveAs(blob, 'soundscape_meta.json')
    }

    this.setState({isExportDialogOpen: false})
  }

  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <Fragment>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => this.setState({isExportDialogOpen: true})}
        >
          METADATA
        </Button>

        <Dialog
          open={this.state.isExportDialogOpen}
          onClose={() => this.handleExportMetaResponse(false)}
        >
          <DialogTitle>Export Soundscape Metadata</DialogTitle>

          <DialogContent>
            <DialogContentText>
              This action may require some time. Please wait for the soundscape to be ready for export. Press OK to continue...
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => this.handleExportMetaResponse(false)}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => this.handleExportMetaResponse(true)}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    )
  }
}

ExportMetaButton.propTypes = {
  listener: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
  sources: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  listener: state.listener,
  room: state.room,
  sources: state.sources.sources,
})

export default connect(
  mapStateToProps,
  null
)(ExportMetaButton)
