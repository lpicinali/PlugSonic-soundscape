import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
import { map } from 'lodash'
import got from 'got'
import { Button } from '@material-ui/core'

/* ========================================================================== */
/* EXPORT RAW BUTTON */
/* ========================================================================== */
class ExportMetaButton extends Component {
  handleExportSoundscapeRaw = () => {
    // const res = confirm(`This action may require some time.\nPlease wait for the soundscape to be ready for export.\nPress OK to continue...`)

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
        raw:                source.raw,
        reach:              source.reach,
        spatialised:        source.spatialised,
        timings:            source.timings,
        url:                source.url,
        volume:             source.volume,
      }))

    // if (res === true) {
      const soundscape = {
        sources: this.props.sources,
        listener: this.props.listener,
        room: this.props.room,
      }
      const clone = JSON.parse(JSON.stringify(soundscape))

      clone.sources = map(clone.sources, source => {
        if (source.url !== null) {
          return got(source.url, { encoding: null }).then(response => {
            console.log('RESPONSE')
            console.log(response)
            source.raw = Array.from(response.body)
            console.log('ARRAY')
            console.log(source.raw)
            const uInt = Uint8Array.from(response.body)
            console.log('UINT')
            console.log(uInt)
          })
        }
        return source
      })

      Promise.all(clone.sources).then(responses => {
        const json = JSON.stringify(clone)
        const file = new File([json], { type: 'application/json' })
        FileSaver.saveAs(file, 'soundscape_whole.json')
        if (responses) {
          alert(`Soundscape ready for export.\nPress OK to choose the location and save file...`)
        }
      })
    // }
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
