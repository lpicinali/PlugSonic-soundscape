import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
import { map } from 'lodash'
import got from 'got'
import { Button } from '@material-ui/core'

import { getSourceRawData } from 'src/audio/engine'
import { SourceOrigin } from 'src/constants'
import { API, httpGetSync, sessionToken, httpGetAsync } from 'src/pluggy.js'

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
      raw:                source.origin === SourceOrigin.LOCAL ?
                            getSourceRawData(source.name)
                            : null,
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

    for (let i = 0; i < soundscape.sources.length; i++) {
      if (soundscape.sources[i].url !== null) {
        got(soundscape.sources[i].url, { encoding: null }).then(response => {
          console.log(response)
          soundscape.sources[i].raw = Array.from(response.body)
        })
      }
    }

    Promise.all(soundscape.sources).then(responses => {
      console.log('PROMISE.ALL')
      console.log(soundscape.sources)
      console.log('RESPONSES')
      console.log(responses)
      if (responses) {
        soundscape.sources = responses
        const json = JSON.stringify(soundscape, null, 2)
        console.log('JSON')
        console.log(json)
      }
      // const file = new File([json], { type: 'application/json' })
      // FileSaver.saveAs(file, 'soundscape_whole.json')
      // if (responses) {
      //   // alert(`Soundscape ready for export.\nPress OK to choose the location and save file...`)
      // }
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
