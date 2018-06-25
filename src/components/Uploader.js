/* eslint react/prefer-stateless-function: 0 */
/* eslint react/forbid-prop-types: 0 */
/* eslint no-unused-vars: 0 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { fetchAudioBufferRaw } from 'src/utils'
import Button from 'src/components/Button.js'
import { StyledTextField, Container, Dropzone, ActionIcon } from 'src/components/Uploader.style'
/**
 * Uploader
 */
class Uploader extends Component {
  static propTypes = {
    titles: PropTypes.array,
    onAddSource: PropTypes.func.isRequired
  }

  static defaultProps = {
    titles: [],
  }

  state = {
    raw: [],
    file: {},
    filename: '',
    filesize: '',
    errorFile: 'Supported formats: WAV and MP3',
    title: '',
    errorTextT: '',
  }

  @autobind
  handleTextFieldChange(event) {
    const val = event.target.value

    if (this.props.titles.indexOf(val) >= 0) {
      this.setState({
        ...this.state,
        title: val,
        errorTextT: `Already in use`,
      })
    } else {
      this.setState({ ...this.state, title: val, errorTextT: '' })
    }
  }

  @autobind
  /* eslint class-methods-use-this:0 */
  handleOnDrop(accepted, rejected) {
    if(accepted.length > 0){
      const reader = new FileReader()

      reader.readAsArrayBuffer(accepted[0])

      reader.onload = () => {
        const view = new Uint8Array(reader.result)
        const array = Array.from(view)

        fetchAudioBufferRaw(array)
          .then(audioBuffer => {
            if ( audioBuffer.numberOfChannels >= 2 ) {
              this.setState({
                ...this.state,
                filename: accepted[0].name, filesize: accepted[0].size, errorFile: 'Convert file to mono before loading it'
              })
            } else {
              this.setState({
                ...this.state,
                raw:  array,
                file: accepted[0],
                filename: accepted[0].name,
                filesize: accepted[0].size,
                errorFile: ''
              })
            }
          })
          .catch(err => console.error(err))
      }

      reader.onabort = () => {
        this.setState({...this.state, filename: '', filesize: '', errorFile: 'File reading was aborted'})
      }
      reader.onerror = () => {
        this.setState({...this.state, filename: '', filesize: '', errorFile: 'File reading has failed'})
      }

    } else {
      this.setState({...this.state, filename: '', filesize: '', errorFile: 'Unsupported file format'})
    }
  }

  @autobind
  handleAddSource() {
    this.props.onAddSource(
      this.state.title,
      this.state.title.replace(/\s/g,'').toLowerCase(),
      '',
      this.state.raw
    )
    this.setState({
      raw: [],
      file: {},
      filename: '',
      filesize: '',
      errorFile: 'Supported formats: WAV and MP3',
      title: '',
      errorTextT: '',
    })
  }

  render() {
    return (
      <div>
        <Container>
          <Dropzone className="dropzone" accept="audio/wav, audio/mpeg, audio/mp3"
            onDrop={(accepted, rejected) => this.handleOnDrop(accepted, rejected)}>
            <div className="dropzone-call">
              <div><ActionIcon/></div>
              <div>
                {this.state.filename === '' ? (
                  'Drop a mono audio file here (or click) to load it.'
                ) : (
                  `${this.state.filename} - ${this.state.filesize} bytes`
                )
              }
              </div>
              <div style={{ height: `12px` }}>
                {this.state.errorFile === '' ? '' : `${this.state.errorFile}`}
              </div>
            </div>
          </Dropzone>
        </Container>

        <div>
          <StyledTextField
            id="title"
            type="text"
            value={this.state.title}
            errorText={this.state.errorTextT}
            floatingLabelText="Title"
            onChange={this.handleTextFieldChange}
          />
          <Button
            key="add"
            isEnabled={this.state.filename !== '' && this.state.errorFile === ''}
            onClick={this.handleAddSource}
            style={{ float: `left` }}
          >
            Add Source
          </Button>
        </div>
      </div>
    )
  }

}

export default Uploader
