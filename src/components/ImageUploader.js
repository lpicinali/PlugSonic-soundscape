/* eslint react/prefer-stateless-function: 0 */
/* eslint react/forbid-prop-types: 0 */
/* eslint no-unused-vars: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint react/no-unused-state: 0 */
import React, { Component } from 'react'
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { fetchAudioBufferRaw } from 'src/utils'

import {H2} from 'src/styles/elements'
import {Dropzone, ActionIcon} from 'src/components/ImageUploader.style'

import {setRoomImage} from 'src/actions/room.actions'
/* ========================================================================== */
/* IMAGE UPLOADER */
/* ========================================================================== */
class ImageUploader extends Component {
  state = {
    name: '',
    size: '',
    type: '',
    preview: '',
    raw: '',
    error: ''
  }

  handleOnDrop(accepted, rejected) {
    if (accepted.length === 0) {
      this.setState({
        ...this.state,
        error: 'Unsupported file format)'
      })
    } else if (accepted.length === 1) {
      const reader = new FileReader()
      const file = accepted[0]

      reader.readAsDataURL(accepted[0])

      reader.onabort = () => {this.setState({...this.state, name: '', size: '', error: 'File reading was aborted'})}
      reader.onerror = () => {this.setState({...this.state, name: '', size: '', error: 'File reading has failed'})}
      reader.onload = () => {
        this.setState({
          ...this.state,
          name: accepted[0].name,
          size: accepted[0].size,
          type: accepted[0].type,
          preview: accepted[0].preview,
          raw: reader.result,
          error: ''
        })
        this.props.onRoomImageChange({
          name: this.state.name,
          size: this.state.size,
          type: this.state.type,
          preview: this.state.preview,
          raw: this.state.raw,
        })
      }
    } else {
      this.setState({...this.state, name: '', size: '', error: 'Please load only one file'})
    }
  }

  render() {
    return (
      <React.Fragment>
        <H2>ROOM FLOORPLAN</H2>
        <Dropzone
          accept="image/*"
          onDrop={(accepted, rejected) => this.handleOnDrop(accepted, rejected)}
        >
          <ActionIcon/>
          <div>
            {this.state.name === '' ? (
                'Drop an image file here (or click) to load it.'
            ) : (
                `${this.state.name} - ${this.state.size} bytes`
            )
            }
          </div>
          <div style={{ height: `12px`, marginBottom: `10px` }}>
            {this.state.error === '' ? '' : `${this.state.error}`}
          </div>
        </Dropzone>
      </React.Fragment>
    )
  }

}

ImageUploader.propTypes = {
  onRoomImageChange: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  onRoomImageChange: image => dispatch(setRoomImage(image)),
})

export default connect(null,mapDispatchToProps)(ImageUploader)
