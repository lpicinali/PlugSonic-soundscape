/* eslint react/prefer-stateless-function: 0 */
/* eslint react/forbid-prop-types: 0 */
/* eslint no-unused-vars: 0 */
/* eslint no-alert: 0 */
/* eslint prefer-destructuring: 0 */
/* eslint no-restricted-globals: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import FileSaver from 'file-saver'
import Blob from 'blob'
import got from 'got'
import bufferToArrayBuffer from 'buffer-to-arraybuffer'
import FileReaderInput from 'react-file-reader-input'
import { map, isEmpty } from 'lodash'

import context from 'src/audio/context.js'
import decode from 'src/audio/decode.js'
import { fetchWavFile } from 'src/utils'
import { PlaybackState } from 'src/constants.js'
import { handleImportRoom } from 'src/containers/PositionControllerContainer'

import { setPlaybackState } from 'src/actions/controls.actions.js'
import { importTargets, importSelected } from 'src/actions/target.actions.js'
import { setListenerPosition } from 'src/actions/listener.actions.js'
import { importRoom } from 'src/actions/room.actions.js'

import Button from 'src/components/Button'
import {
  StyledFileInput,
  ContainerDiv,
  ImportExportButtonDiv,
} from 'src/containers/ImportExportContainer.style'

import { H2, H3 } from 'src/styles/elements.js'

/**
 * Import/Export Container
 */
class ImportExportContainer extends Component {
  static propTypes = {
    targets: PropTypes.object.isRequired,
    selected: PropTypes.array,
    listenerPosition: PropTypes.object.isRequired,
    room: PropTypes.object.isRequired,
    onSetPlaybackState: PropTypes.func.isRequired,
    onImportTargets: PropTypes.func.isRequired,
    onImportSelected: PropTypes.func.isRequired,
    onImportListenerPosition: PropTypes.func.isRequired,
    onImportRoom: PropTypes.func.isRequired,
  }

  static defaultProps = {
    selected: [],
  }

  @autobind
  handleExportAssets() {
    const soundscape = {
      targets: this.props.targets,
      selected: this.props.selected,
      listenerPosition: this.props.listenerPosition,
      room: this.props.room,
    }

    const promises = map(soundscape.targets, target =>
      got(target.url, { encoding: null }).then(response => ({
        [target.filename]: response.body,
      }))
    )

    Promise.all(promises).then(
      promises.map(promise => promise)
    )
  }

  handleImportSoundscape = (evt, results) => {
    const res = confirm('This action may require some time.\nPlease wait for another message before performing other actions.\nPress OK to continue...')

    if (res === true) {
      results.forEach(result => {
        const [e, file] = result
        const soundscape = JSON.parse(e.target.result)
        this.props.onSetPlaybackState(PlaybackState.PAUSED)
        this.props.onImportTargets(soundscape.targets)
        this.props.onImportSelected(soundscape.selected)
        this.props.onImportListenerPosition(soundscape.listenerPosition)
        handleImportRoom(soundscape.room)
        this.props.onImportRoom(soundscape.room)
      })
    }
  }

  @autobind
  handleExportSoundscapeMeta() {
    try {
      const isFileSaverSupported = !!new Blob()
    } catch (e) {
      alert('The File APIs are not fully supported in this browser.')
    }

    const res = confirm(`This action may require some time.\nPlease wait for the soundscape to be ready for export.\nPress OK to continue...`)

    if (res === true) {
      const soundscape = {
        targets: this.props.targets,
        selected: this.props.selected,
        listenerPosition: this.props.listenerPosition,
        room: this.props.room,
      }
      const clone = JSON.parse(JSON.stringify(soundscape))

      console.log('export meta')
      map(clone.targets, target => {
        clone.targets[target.filename].raw = []
      })
      const json = JSON.stringify(clone, null, 2)
      const blob = new File([json], { type: 'application/json' })
      alert(`Soundscape ready for export.\nPress OK to choose the location and save file...`)
      FileSaver.saveAs(blob, 'soundscape_meta.json')
    }
  }

  @autobind
  handleExportSoundscapeRaw() {
    try {
      const isFileSaverSupported = !!new Blob()
    } catch (e) {
      alert('The File APIs are not fully supported in this browser.')
    }

    const res = confirm(`This action may require some time.\nPlease wait for the soundscape to be ready for export.\nPress OK to continue...`)

    if (res === true) {
      const soundscape = {
        targets: this.props.targets,
        selected: this.props.selected,
        listenerPosition: this.props.listenerPosition,
        room: this.props.room,
      }
      const clone = JSON.parse(JSON.stringify(soundscape))

      console.log('export raw')
      const promises = map(clone.targets, target => {
        if ( target.url !== '' ) {
          return got(target.url, { encoding: null })
            .then(response => {
              clone.targets[target.filename].raw = Array.from(response.body)
            })
        }

        clone.targets[target.filename].raw = target.raw
        return target.raw
      })

      Promise.all(promises).then(responses => {
        const json = JSON.stringify(clone)
        const file = new File([json], { type: 'application/json' })
        FileSaver.saveAs(file, 'soundscape_whole.json')
        if (responses) {
          alert(`Soundscape ready for export.\nPress OK to choose the location and save file...`)
        }
      })
    }
  }

  render() {
    return (
      <ContainerDiv>

        <H2>Import/Export</H2>

        <H3>Soundscape</H3>
        <ImportExportButtonDiv>
          <FileReaderInput
            type="file"
            accept=".json"
            as="binary"
            id="importmeta"
            onChange={this.handleImportSoundscape}
          >
            <StyledFileInput>Import</StyledFileInput>
          </FileReaderInput>

          <Button
            key="exportmeta"
            onClick={this.handleExportSoundscapeMeta}
          >
            Export
          </Button>
        </ImportExportButtonDiv>


        <H3 style={{ marginTop: `16px` }}>Soundscape + Assets</H3>
        <ImportExportButtonDiv>
          <FileReaderInput
            type="file"
            accept=".json"
            as="binary"
            id="importraw"
            onChange={this.handleImportSoundscape}
          >
            <StyledFileInput style={{ float: `left` }}>Import</StyledFileInput>
          </FileReaderInput>

          <Button
            key="exportraw"
            onClick={this.handleExportSoundscapeRaw}
          >
            Export
          </Button>
        </ImportExportButtonDiv>

      </ContainerDiv>
    )
  }
}

export default connect(
  state => ({
    targets: state.target.targets,
    selected: state.target.selected,
    listenerPosition: state.listener.position,
    room: state.room,
  }),
  dispatch => ({
    onSetPlaybackState: state => dispatch(setPlaybackState(state)),
    onImportTargets: targets => dispatch(importTargets(targets)),
    onImportSelected: selected => dispatch(importSelected(selected)),
    onImportListenerPosition: position => dispatch(setListenerPosition(position)),
    onImportRoom: room => dispatch(importRoom(room)),
  })
)(ImportExportContainer)
