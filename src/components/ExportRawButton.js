import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FileSaver from 'file-saver'
import Blob from 'blob'
import { map } from 'lodash'
import got from 'got'
import { Button } from '@material-ui/core'

/* ========================================================================== */
const FlatButtonStyle = {
  width: '85%',
  margin: `auto`,
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
/* ========================================================================== */
/* EXPORT RAW BUTTON */
/* ========================================================================== */
class ExportMetaButton extends Component {
  handleExportSoundscapeRaw = () => {
    try {
      const isFileSaverSupported = !!new Blob()
    } catch (e) {
      alert('The File APIs are not fully supported in this browser.')
    }

    // const res = confirm(`This action may require some time.\nPlease wait for the soundscape to be ready for export.\nPress OK to continue...`)

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
            source.raw = Array.from(response.body)
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
      <Container>
        <Button
          variant="contained"
          color="secondary"
          style={FlatButtonStyle}
          onClick={this.handleExportSoundscapeRaw}
        >
          META+ASSETS
        </Button>
      </Container>
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
