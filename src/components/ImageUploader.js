import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'

import { H2 } from 'src/styles/elements'
import { Dropzone, ActionIcon } from 'src/components/ImageUploader.style'
import { setRoomImage } from 'src/actions/room.actions'
import {
  API,
  httpPostAsync,
  httpDeleteAsync,
  sessionToken,
} from 'src/pluggy'

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
      // console.log('FILE')
      // console.log(file)
      // const formData = new FormData()
      // const jsonFile = JSON.stringify(file)
      // const blob = new Blob([jsonFile], {type: 'application/json'});
      // formData.append('file', file, file.name);
      // formData.append('file', blob, file.name);
      // console.log('FORMDATA')
      // console.log(formData.get('file'))

      const reader = new FileReader()
      reader.readAsDataURL(file)
      // const reader2 = new FileReader()
      // reader2.readAsDataURL(formData.get('file'))

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
        // console.log('FILE RAW')
        // console.log(reader.result)
        // console.log('BtoA')
        // console.log(window.btoa(reader.result))
        // console.log('AtoB')
        // console.log(window.atob(window.btoa(reader.result)))

        this.setState({
          ...this.state,
          raw: reader.result,
          error: '',
        })

        this.props.onRoomImageChange({
          // mediaId: uploadedImage.id,
          raw: this.state.raw,
        })
        // httpPostAsync(
        //   `${API}/exhibitions/${this.props.exhibitionId}/media`,
        //   this.uploadImageCallback,
        //   this.uploadImageErrorCallback,
        //   formData,
        //   sessionToken,
        // )
      }

      // reader2.onload = () => {
      //   console.log('FORMDATA RAW')
      //   console.log(reader2.result)
      // }
    } else {
      this.setState({
        ...this.state,
        raw: '',
        error: 'Please load only one file',
      })
    }
  }

  // uploadImageCallback = responseText => {
  //   const uploadedImage = JSON.parse(responseText)
  //   console.log('uploadImageCallback')
  //   console.log(uploadedImage)
  //
  //   this.props.onRoomImageChange({
  //     mediaId: uploadedImage.id,
  //     raw: this.state.raw,
  //   })
  // }
  //
  // uploadImageErrorCallback = responseText => {
  //   const error = JSON.parse(responseText)
  //   console.log('uploadImageErrorCallback')
  //   console.log(error)
  // }

  /* -------------------- RESET IMAGE ------------------*/
  resetImage = () => {
    // if (this.props.backgroundImageMediaId) {
    //   httpDeleteAsync(
    //     `${API}/exhibitions/${this.props.exhibitionId}/media/${this.props.backgroundImageMediaId}`,
    //     this.resetImageCallback,
    //     this.resetImageErrorCallback,
    //     sessionToken,
    //   )
    // }
    this.setState({
      ...this.state,
      // filename: '',
      // size: '',
      // type: '',
      // preview: '',
      raw: '',
      error: '',
    })
    this.props.onRoomImageChange({
      // filename: '',
      // size: '',
      // type: '',
      // preview: '',
      raw: '',
    })
  }

  resetImageCallback = responseText => {
    const resetImage = JSON.parse(responseText)
    console.log('resetImageCallback')
    console.log(resetImage)

    this.setState({
      ...this.state,
      mediaId: '',
      error: '',
    })

    this.props.onRoomImageChange({
      mediaId: '',
      raw: '',
    })
  }

  resetImageErrorCallback = responseText => {
    const error = JSON.parse(responseText)
    console.log('resetImageErrorCallback')
    console.log(error)
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
            {/* {this.state.filename === ''
              ? 'Drop an image file here (or click) to load it.'
            : `${this.state.filename} - ${this.state.size} bytes`} */}
            {'Drop an image file here (or click) to load it.'}
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
