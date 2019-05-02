import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'

import { H2 } from 'src/styles/elements'
import { Dropzone, ActionIcon } from 'src/components/ImageUploader.style'
import { setRoomImage } from 'src/actions/room.actions'

/* ========================================================================== */
/* IMAGE UPLOADER */
/* ========================================================================== */
class ImageUploader extends Component {
  state = {
    filename: '',
    size: '',
    type: '',
    preview: '',
    raw: '',
    error: '',
  }

  handleOnDrop = (accepted, rejected) => {
    if (accepted.length === 0) {
      this.setState({
        ...this.state,
        error: 'Unsupported file format)',
      })
    } else if (accepted.length === 1) {
      const reader = new FileReader()
      const file = accepted[0]

      reader.readAsDataURL(accepted[0])

      reader.onabort = () => {
        this.setState({
          ...this.state,
          filename: '',
          size: '',
          error: 'File reading was aborted',
        })
      }
      reader.onerror = () => {
        this.setState({
          ...this.state,
          filename: '',
          size: '',
          error: 'File reading has failed',
        })
      }
      reader.onload = () => {
        this.setState({
          ...this.state,
          filename: accepted[0].name,
          size: accepted[0].size,
          type: accepted[0].type,
          preview: accepted[0].preview,
          raw: reader.result,
          error: '',
        })
        this.props.onRoomImageChange({
          filename: this.state.name,
          size: this.state.size,
          type: this.state.type,
          preview: this.state.preview,
          raw: this.state.raw,
        })
      }
    } else {
      this.setState({
        ...this.state,
        filename: '',
        size: '',
        error: 'Please load only one file',
      })
    }
  }

  resetImage = () => {
    this.setState({
      ...this.state,
      filename: '',
      size: '',
      type: '',
      preview: '',
      raw: '',
      error: '',
    })
    this.props.onRoomImageChange({
      filename: '',
      size: '',
      type: '',
      preview: '',
      raw: '',
      error: '',
    })
  }

  render() {
    return (
      <Fragment>
        <H2>ROOM FLOORPLAN</H2>
        <Dropzone
          accept="image/*"
          onDrop={(accepted, rejected) => this.handleOnDrop(accepted, rejected)}
        >
          <ActionIcon />
          <div>
            {this.state.filename === ''
              ? 'Drop an image file here (or click) to load it.'
              : `${this.state.filename} - ${this.state.size} bytes`}
          </div>
          <div style={{ height: `12px`, marginBottom: `10px` }}>
            {this.state.error === '' ? '' : `${this.state.error}`}
          </div>
        </Dropzone>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={this.resetImage}
        >
          RESET IMAGE
        </Button>
      </Fragment>
    )
  }
}

ImageUploader.propTypes = {
  onRoomImageChange: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  onRoomImageChange: image => dispatch(setRoomImage(image)),
})

export default connect(
  null,
  mapDispatchToProps
)(ImageUploader)
