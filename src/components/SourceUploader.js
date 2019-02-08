import React, { Component } from 'react'
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { map } from 'lodash'
import { fetchAudioBufferRaw } from 'src/utils'

import * as colors from 'src/styles/colors'
import {H2} from 'src/styles/elements'
import {Dropzone, ActionIcon} from 'src/components/SourceUploader.style'
import FlatButton from "material-ui/FlatButton"
import TextField from 'material-ui/TextField'

import { addSource } from 'src/actions/sources.actions'
/* ========================================================================== */
const FlatButtonStyle = {
  width: '85%',
  margin: `auto`,
  textColor: `${colors.WHITE}`,
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
export const TextButtonStyle = {
  marginLeft: `20px`,
  width: `85%`
}
export const errorStyle = {
  textColor: `colors.BLACK`
}
const underlineStyle = {
  borderColor: `colors.BLACK`,
}
const underlineFocusStyle = {
  borderColor: `colors.BLACK`,
}
/* ========================================================================== */
/* SOURCE UPLOADER */
/* ========================================================================== */
class SourceUploader extends Component {

  state = {
    file: {},
    filename: '',
    size: '',
    raw: [],
    errorFile: '',
    name: '',
    errorTextField: '',
  }

  handleTextFieldChange = (event) => {
    const val = event.target.value
    if (this.props.names.indexOf(val) >= 0) {
      this.setState({
        ...this.state,
        name: val,
        errorTextField: `Already in use`,
      })
    } else {
      this.setState({ ...this.state, name: val, errorTextField: '' })
    }
  }

  handleOnDrop = (accepted, rejected) => {
    if (accepted.length === 0) {
      this.setState({
        ...this.state,
        error: 'Unsupported file format)'
      })
    } else if (accepted.length === 1) {
      const reader = new FileReader()

      reader.readAsArrayBuffer(accepted[0])

      reader.onabort = () => {
        this.setState({...this.state, filename: '', size: '', errorFile: 'File reading was aborted'})
      }
      reader.onerror = () => {
        this.setState({...this.state, filename: '', size: '', errorFile: 'File reading has failed'})
      }
      reader.onload = () => {
        const view = new Uint8Array(reader.result)
        const array = Array.from(view)

        fetchAudioBufferRaw(array)
          .then(audioBuffer => {
            if ( audioBuffer.numberOfChannels > 2 ) {
              this.setState({
                ...this.state,
                filename: accepted[0].name, size: accepted[0].size, errorFile: 'Error with file format (Number of Channels > 2)'
              })
            } else {
              this.setState({
                ...this.state,
                raw:  array,
                file: accepted[0],
                filename: accepted[0].name,
                size: accepted[0].size,
                errorFile: ''
              })
            }
          })
        .catch(err => console.error(err))
      }
    } else {
      this.setState({...this.state, filename: '', size: '', error: 'Please load only one file'})
    }
  }

  handleAddSource = () => {
    this.props.onAddSource(
      this.state.filename.replace(/\s/g,'').toLowerCase(),
      this.state.name,
      this.state.raw
    )
    this.setState({
      raw: [],
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
      <Container>
        <Dropzone
          accept="audio/*"
          onDrop={(accepted, rejected) => this.handleOnDrop(accepted, rejected)}
        >
          <ActionIcon/>
          <div>
            {this.state.filename === '' ? (
                'Drop an audio file here (or click) to load it.'
            ) : (
                `${this.state.filename} - ${this.state.size} bytes`
            )
            }
          </div>
          <div style={{ height: `12px`, marginBottom: `10px` }}>
            {this.state.errorFile === '' ? '' : `${this.state.errorFile}`}
          </div>
        </Dropzone>

        <TextField
          id="name"
          type="text"
          value={this.state.name}
          errorText={this.state.errorTextField}
          floatingLabelFixed
          // floatingLabelFocusStyle={tfFloatingLabelFocusStyle}
          // floatingLabelStyle={tfFloatingLabelStyle}
          floatingLabelText="Name"
          onChange={this.handleTextFieldChange}
          // inputStyle={tfInputStyle}
          style={TextButtonStyle}
          underlineFocusStyle={underlineFocusStyle}
          underlineStyle={underlineStyle}
        />

        <FlatButton
          // disabled={this.state.filename === '' || this.state.errorFile !== ''}
          style={FlatButtonStyle}
          backgroundColor={`${colors.BLACK}`}
          onClick={this.handleAddSource}
          secondary
        >
          ADD SOURCE
        </FlatButton>

      </Container>
    )
  }
}

SourceUploader.propTypes = {
  names: PropTypes.array.isRequired,
  onAddSource: PropTypes.func.isRequired
}

SourceUploader.defaultProps = {
  names: [],
}

const mapStateToProps = state => ({
  names: map(state.sources.sources, source => source.name)
})

const mapDispatchToProps = dispatch => ({
  onAddSource: (filename, name, raw) =>
      dispatch(addSource(filename, name, raw)),
})

export default connect(mapStateToProps,mapDispatchToProps)(SourceUploader)
