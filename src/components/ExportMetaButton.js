import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
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
      const listener = this.props.listener
      const room = this.props.room
      const sources = map(this.props.sources, source => ({
        enabled:            source.enabled,
        filename:           source.filename,
        hidden:             source.hidden,
        loop:               source.loop,
        name:               source.name,
        platform_asset_id:  source.platform_asset_id,
        platform_media_id:  source.platform_media_id,
        position:           source.position,
        raw:                null,
        reach:              source.reach,
        spatialised:        source.spatialised,
        timings:            source.timings,
        url:                source.url,
        volume:             source.volume,
      }))

      const soundscape = {
        listener: listener,
        room:     room,
        sources:  sources,
      }

      const json = JSON.stringify(soundscape, null, 2)
      const blob = new File([json], { type: 'application/json' })
      FileSaver.saveAs(blob, 'soundscape_meta.soundscape')
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
