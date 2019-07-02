import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { Button, FormHelperText, TextField } from '@material-ui/core'

import { SourceOrigin } from 'src/constants.js'
import { fetchAudioBufferRaw } from 'src/utils.js'
import { addSource } from 'src/actions/sources.actions.js'
import { storeSourceAudioBuffer, storeSourceRawData } from 'src/audio/engine.js'
import { Dropzone, ActionIcon } from 'src/components/SourceUploader.style.js'
import { PaddedFormControl, PanelContents } from 'src/styles/elements.js'

/* ========================================================================== */
/* SOURCE UPLOADER */
/* ========================================================================== */
class SourceUploader extends Component {
  state = {
    file: {},
    filename: '',
    size: '',
    raw: [],
    audioBuffer: null,
    errorFile: '',
    name: '',
    errorTextField: '',
  }

  handleTextFieldChange = event => {
    const val = event.target.value
    if (this.props.names.indexOf(val) >= 0) {
      this.setState({
        ...this.state,
        name: val,
        errorTextField: `Already in use`,
      })
    } else {
      this.setState({
        ...this.state,
        name: val,
        errorTextField: '',
      })
    }
  }

  handleOnDrop = accepted => {
    if (accepted.length === 0) {
      this.setState({
        errorFile: 'Unsupported file format',
      })
    } else if (accepted.length === 1) {
      const reader = new FileReader()

      reader.readAsArrayBuffer(accepted[0])

      reader.onabort = () => {
        this.setState({
          ...this.state,
          filename: '',
          size: '',
          errorFile: 'File reading was aborted',
        })
      }

      reader.onerror = () => {
        this.setState({
          ...this.state,
          filename: '',
          size: '',
          errorFile: 'File reading has failed',
        })
      }

      reader.onload = () => {
        const view = new Uint8Array(reader.result)
        const array = Array.from(view)

        fetchAudioBufferRaw(array)
          .then(audioBuffer => {
            if (audioBuffer.numberOfChannels > 2) {
              this.setState({
                ...this.state,
                filename: accepted[0].name,
                size: accepted[0].size,
                errorFile: 'Error with file format (Number of Channels > 2)',
              })
            } else {
              this.setState({
                ...this.state,
                audioBuffer,
                raw: array,
                file: accepted[0],
                filename: accepted[0].name,
                size: accepted[0].size,
                errorFile: '',
              })
            }
          })
          .catch(err => console.error(err))
      }
    } else {
      this.setState({
        ...this.state,
        filename: '',
        size: '',
        errorFile: 'Please load only one file',
      })
    }
  }

  handleAddSource = () => {
    const { onAddSource } = this.props
    const { name, filename, audioBuffer, raw } = this.state

    storeSourceAudioBuffer(name, audioBuffer)
    storeSourceRawData(name, raw)

    onAddSource(filename.replace(/\s/g, '').toLowerCase(), name)

    this.setState({
      raw: [],
      audioBuffer: null,
      file: {},
      filename: '',
      size: '',
      errorFile: '',
      name: '',
      errorTextT: '',
    })
  }

  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <PanelContents>
        <Dropzone
          accept="audio/mp3, audio/mpeg"
          onDrop={(accepted, rejected) => this.handleOnDrop(accepted, rejected)}
        >
          <ActionIcon />
          <div>
            {this.state.filename === ''
              ? 'Drop an mp3 file here (or click) to load it.'
              : `${this.state.filename} - ${this.state.size} bytes`}
          </div>
          <div style={{ height: `12px`, marginBottom: `10px` }}>
            {this.state.errorFile === '' ? '' : `${this.state.errorFile}`}
          </div>
        </Dropzone>

        <PaddedFormControl fullWidth error={this.state.errorTextField !== ''}>
          <TextField
            fullWidth
            id="name"
            type="text"
            value={this.state.name}
            label="Name"
            onChange={this.handleTextFieldChange}
          />
          {this.state.errorTextField !== '' && (
            <FormHelperText>{this.state.errorTextField}</FormHelperText>
          )}
        </PaddedFormControl>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={this.state.name === '' || this.state.errorTextField !== ''}
          onClick={this.handleAddSource}
        >
          ADD SOURCE
        </Button>
      </PanelContents>
    )
  }
}

SourceUploader.propTypes = {
  names: PropTypes.array.isRequired,
  onAddSource: PropTypes.func.isRequired,
}

SourceUploader.defaultProps = {
  names: [],
}

const mapStateToProps = state => ({
  names: map(state.sources.sources, source => source.name),
})

const mapDispatchToProps = dispatch => ({
  onAddSource: (filename, name) =>
    dispatch(addSource({ filename, name, origin: SourceOrigin.LOCAL })),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceUploader)
