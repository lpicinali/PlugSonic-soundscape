import { connect } from 'react-redux'
import FileReaderInput from 'react-file-reader-input'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

import { Button } from '@material-ui/core'

import * as colors from 'src/styles/colors'
import { PlaybackState } from 'src/constants'
import { setPlaybackState } from 'src/actions/controls.actions'
import { importSources } from 'src/actions/sources.actions'
import { importListener } from 'src/actions/listener.actions'
import { importRoom } from 'src/actions/room.actions'

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
/* IMPORT BUTTON */
/* ========================================================================== */
class ImportButton extends Component {
  handleImportSoundscape = (evt, results) => {
    // const res = confirm('This action may require some time.\nPlease wait for another message before performing other actions.\nPress OK to continue...')

    // if (res === true) {
      results.forEach(result => {
        const [e, file] = result
        const soundscape = JSON.parse(e.target.result)
        this.props.onSetPlaybackState(PlaybackState.PAUSE)
        this.props.onImportSources(soundscape.sources)
        this.props.onImportListener(soundscape.listener)
        this.props.onImportRoom(soundscape.room)
      })
    // }
  }

  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <Container>
        <Button variant="contained" color="secondary" style={FlatButtonStyle}>
          <FileReaderInput
            type="file"
            accept=".json"
            as="binary"
            onChange={this.handleImportSoundscape}
          >
            METADATA/META+ASSETS
          </FileReaderInput>
        </Button>
      </Container>
    )
  }
}

ImportButton.propTypes = {
  onSetPlaybackState: PropTypes.func.isRequired,
  onImportSources: PropTypes.func.isRequired,
  onImportListener: PropTypes.func.isRequired,
  onImportRoom: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  onSetPlaybackState: state => dispatch(setPlaybackState(state)),
  onImportSources: sources => dispatch(importSources(sources)),
  onImportListener: listener => dispatch(importListener(listener)),
  onImportRoom: room => dispatch(importRoom(room)),
})

export default connect(
  null,
  mapDispatchToProps
)(ImportButton)
