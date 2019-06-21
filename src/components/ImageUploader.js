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
    raw: '',
    error: '',
  }

  /* -------------------- UPLOAD IMAGE ------------------*/
  handleOnDrop = (accepted) => {
    if (accepted.length === 0) {
      this.setState({
        ...this.state,
        error: 'Unsupported file format)',
      })
    } else if (accepted.length === 1) {
      const file = accepted[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onabort = () => {
        this.setState({
          ...this.state,
          raw:'',
          error: 'File reading was aborted',
        })
      }

      reader.onerror = () => {
        this.setState({
          ...this.state,
          raw:'',
          error: 'File reading has failed',
        })
      }

      reader.onload = () => {

        this.setState({
          ...this.state,
          raw: reader.result,
          error: '',
        })

        this.props.onRoomImageChange({
          raw: this.state.raw,
        })
      }
    } else {
      this.setState({
        ...this.state,
        raw: '',
        error: 'Please load only one file',
      })
    }
  }

  /* -------------------- RESET IMAGE ------------------*/
  resetImage = () => {
    this.setState({
      ...this.state,
      raw: '',
      error: '',
    })
    this.props.onRoomImageChange({
      raw: '',
    })
  }

  render() {
    return (
      <Fragment>
        <H2>ROOM FLOORPLAN</H2>
        <Dropzone
          accept="image/*"
          onDrop={(accepted) => this.handleOnDrop(accepted)}
        >
          <ActionIcon />
          <div>
            {'Drop an image file here (or click) to load.'}
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
  backgroundImageMediaId: PropTypes.string.isRequired,
  exhibitionId: PropTypes.string.isRequired,
  onRoomImageChange: PropTypes.func.isRequired,
}

ImageUploader.defaultProps = {
  backgroundImageMediaId: '',
}

const mapStateToProps = state => ({
  backgroundImageMediaId: state.room.backgroundImage.mediaId,
  exhibitionId: state.exhibition.id,
})

const mapDispatchToProps = dispatch => ({
  onRoomImageChange: image => dispatch(setRoomImage(image)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageUploader)
