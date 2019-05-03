import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
import Blob from 'blob'
import { map } from 'lodash'
import got from 'got'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'

/* ========================================================================== */
/* EXPORT RAW BUTTON */
/* ========================================================================== */
class ExportMetaButton extends Component {
  state = {
    isExportDialogOpen: false,
  }

  handleExportRawResponse = (confirm) => {
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
        if (source.url !== null) {
          return got(source.url, { encoding: null }).then(response => {
            source.raw = Array.from(response.body)
          })
        }
        return source
      })

      Promise.all(clone.sources).then(responses => {
        if (responses) {
          const json = JSON.stringify(clone)
          const file = new File([json], { type: 'application/json' })
          FileSaver.saveAs(file, 'soundscape_whole.json')
        }
      })
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
          META+ASSETS
        </Button>

        <Dialog
          open={this.state.isExportDialogOpen}
          onClose={() => this.handleExportRawResponse(false)}
        >
          <DialogTitle>Export Soundscape</DialogTitle>

          <DialogContent>
            <DialogContentText>
              This action may require some time. Please wait for the soundscape to be ready for export. Press OK to continue...
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => this.handleExportRawResponse(false)}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => this.handleExportRawResponse(true)}
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
