import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
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

import { getSourceRawData } from 'src/audio/engine'
/* ========================================================================== */
/* EXPORT RAW BUTTON */
/* ========================================================================== */
class ExportMetaButton extends Component {
  state = {
    isExportDialogOpen: false,
  }

  handleExportRawResponse = confirm => {
    if (confirm) {
      const listener = this.props.listener
      const room = this.props.room
      const sources = map(this.props.sources, source => ({
        enabled: source.enabled,
        filename: source.filename,
        hidden: source.hidden,
        loop: source.loop,
        name: source.name,
        platform_asset_id: source.platform_asset_id,
        platform_media_id: source.platform_media_id,
        position: source.position,
        positioning: source.positioning,
        raw: null,
        relativePosition: source.relativePosition,
        reach: source.reach,
        spatialised: source.spatialised,
        timings: source.timings,
        url: source.url,
        volume: source.volume,
      }))

      const soundscape = {
        listener: listener,
        room: room,
        sources: sources,
      }

      const promises = map(soundscape.sources, (source, index) => {
        if (source.url !== null) {
          return got(source.url, { encoding: null }).then(response => {
            soundscape.sources[index].raw = Array.from(response.body)
          })
        }
        soundscape.sources[index].raw = getSourceRawData(source.name)
        return source
      })

      Promise.all(promises).then(() => {
        const json = JSON.stringify(soundscape)
        const file = new File([json], { type: 'application/json' })
        FileSaver.saveAs(file, 'soundscape_whole.soundscape')
      })
    }

    this.setState({ isExportDialogOpen: false })
  }

  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <Fragment>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => this.setState({ isExportDialogOpen: true })}
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
              This action may require some time. Please wait for the soundscape
              to be ready for export. Press OK to continue...
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => this.handleExportRawResponse(false)}>
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
