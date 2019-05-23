import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
import { map } from 'lodash'
import got from 'got'
import { Button } from '@material-ui/core'

import { getSourceRawData } from 'src/audio/engine'
/* ========================================================================== */
/* EXPORT RAW BUTTON */
/* ========================================================================== */
class ExportMetaButton extends Component {

  handleExportSoundscapeRaw = () => {

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

    const promises = map(
      soundscape.sources,
      (source, index) => {
        if ( source.url !== null ) {
          return got(source.url, { encoding: null })
            .then(response => {
              soundscape.sources[index].raw = Array.from(response.body)
            })
        }
        soundscape.sources[index].raw = getSourceRawData(source.name)
        return source
      }
    )

    Promise.all(promises)
      .then(() => {
        const json = JSON.stringify(soundscape)
        const file = new File([json], { type: 'application/json' })
        FileSaver.saveAs(file, 'soundscape_whole.json')
      })
  }

  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={this.handleExportSoundscapeRaw}
      >
        META+ASSETS
      </Button>
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
