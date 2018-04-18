/* eslint react/prefer-stateless-function: 0 */
/* eslint react/forbid-prop-types: 0 */
/* eslint no-unused-vars: 0 */
/* eslint no-alert: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import FileSaver from 'file-saver'
import Blob from 'blob'
import got from 'got'
import bufferToArrayBuffer from 'buffer-to-arraybuffer'
import context from 'src/audio/context.js'
import decode from 'src/audio/decode.js'
import { map } from 'lodash'
import fetchWavFile from 'src/utils'
import FileReaderInput from 'react-file-reader-input'
import { importTargets } from 'src/actions/target.actions.js'
import { importRoom } from 'src/actions/room.actions.js'
import { PlaybackState } from 'src/constants.js'
import { setPlaybackState } from 'src/actions/controls.actions.js'
import { handleImportRoom } from 'src/containers/PositionControllerContainer'

import Button from 'src/components/Button'

import { H2, H3 } from 'src/styles/elements.js'
import { BLACK, TURQOISE, WHITE } from 'src/styles/colors.js'

const StyledFileInput = styled.button`
  appearance: none;
  padding: 4px 8px;
  margin-right: 8px;
  background: ${WHITE};
  border: 1px solid ${TURQOISE};
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  color: ${BLACK};
  font-size: 16px;
  transition: all 0.15s;

  &:hover {
    box-shadow: 0 0 0 3px ${TURQOISE};
  }
`

/**
 * Import/Export Container
 */
class ImportExportContainer extends Component {
  static propTypes = {
    targets: PropTypes.object.isRequired,
    room: PropTypes.object.isRequired,
    onPauseApp: PropTypes.func.isRequired,
    onImportTargets: PropTypes.func.isRequired,
    onImportRoom: PropTypes.func.isRequired,
  }

  @autobind
  handleExportAssets() {
    const soundscape = {
      targets: this.props.targets,
      room: this.props.room,
    }

    const promises = map(soundscape.targets, target =>
      got(target.url, { encoding: null }).then(response => ({
        [target.filename]: response.body,
      }))
    )

    Promise.all(promises).then(
      promises.map(promise => promise).then(objects => {
        console.log(objects)
      })
      // map(soundscape.targets, (target, index) => {
      //   console.log(pro)
      // const file = new File(promises[index].body, {type: 'audio'});
      // FileSaver.saveAs(file, target.filename)
    )
    //
    // const json = JSON.stringify(soundscape, null, 2);
    // const blob = new File([json], {type: 'application/json'});
    // FileSaver.saveAs(blob, 'soundscape.json')
  }

  @autobind
  handleExportMetadata() {
    try {
      const isFileSaverSupported = !!new Blob()
    } catch (e) {
      alert('The File APIs are not fully supported in this browser.')
    }

    const soundscape = {
      targets: this.props.targets,
      room: this.props.room,
    }

    const json = JSON.stringify(soundscape, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    FileSaver.saveAs(blob, 'soundscape.json')
  }

  @autobind
  handleExportSoundscapeRaw() {
    const soundscape = {
      targets: this.props.targets,
      room: this.props.room,
    }

    const promises = map(soundscape.targets, target =>
      got(target.url, { encoding: null }).then(response => {
        soundscape.targets[target.filename].raw = response.body
      })
    )

    Promise.all(promises).then(responses => {
      const json = JSON.stringify(soundscape)
      const blob = new Blob([json], { type: 'application/json' })
      FileSaver.saveAs(blob, 'soundscape.json')
    })
  }

  handleImportMetadata = (evt, results) => {
    results.forEach(result => {
      const [e, file] = result
      const soundscape = JSON.parse(e.target.result)
      // console.log(soundscape)
      // PAUSE
      this.props.onPauseApp(PlaybackState.PAUSED)
      // IMPORT TARGETS
      this.props.onImportTargets(soundscape.targets)
      // IMPORT ROOM
      // handleImportRoom(soundscape.room)
      this.props.onImportRoom(soundscape.room)
    })
  }

  render() {
    return (
      <div>
        <H2>Import/Export</H2>

        <H3>Soundscape</H3>

        <FileReaderInput
          type="file"
          accept=".json"
          as="binary"
          id="importmeta"
          onChange={this.handleImportMetadata}
        >
          <StyledFileInput style={{ float: `left` }}>Import</StyledFileInput>
        </FileReaderInput>

        <Button key="exportmeta" onClick={this.handleExportMetadata} style={{}}>
          Export
        </Button>

        <H3>Soundscape + Assets</H3>
        <Button
          key="exportrawscape"
          onClick={this.handleExportSoundscapeRaw}
          style={{ float: `left` }}
        >
          Export
        </Button>
      </div>
    )
  }
}

export default connect(
  state => ({
    targets: state.target.targets,
    room: state.room,
  }),
  dispatch => ({
    onPauseApp: state => dispatch(setPlaybackState(state)),
    onImportTargets: targets => dispatch(importTargets(targets)),
    onImportRoom: room => dispatch(importRoom(room)),
    //   // onChangeVolume: volume => dispatch(setTargetVolume(volume)),
  })
)(ImportExportContainer)
