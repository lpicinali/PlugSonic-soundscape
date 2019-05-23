import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { values, toNumber, isNaN } from 'lodash'

import { FormHelperText, TextField } from '@material-ui/core'
import { RoomShape } from 'src/constants.js'
import { setRoomSize } from 'src/actions/room.actions.js'
import { H2, PaddedFormControl } from 'src/styles/elements.js'

/* ========================================================================== */
const minSize = 3
const maxSize = 100
/* ========================================================================== */

/* ========================================================================== */
/* ROOM SIZE TEXT FIELDS */
/* ========================================================================== */
class RoomSizeTextFields extends Component {
  constructor(props) {
    super(props)

    this.state = {
      size: { ...props.roomSize },
      errorTextW: '',
      errorTextD: '',
      errorTextH: '',
    }
  }

  handleTextFieldChange = event => {
    const val = event.target.value
    // ROUND
    if (this.props.roomShape === RoomShape.ROUND) {
      // WIDTH or DEPTH
      if (
        event.target.id === 'width' ||
        event.target.id === 'depth'
      ) {
        // Empty string
        if (val.length === 0) {
          const newSize = { ...this.state.size, width: '', depth: '' }
          this.setState({
            ...this.state,
            size: newSize,
            errorTextW: `Invalid: ${minSize} < W < ${maxSize}`,
            errorTextD: `Invalid: ${minSize} < D < ${maxSize}`,
          })
        }
        // Number
        else if (!isNaN(toNumber(val))) {
          if (val >= minSize && val <= maxSize) {
            const newSize = { ...this.state.size, width: toNumber(val), depth: toNumber(val) }
            this.setState({
              ...this.state,
              size: newSize,
              errorTextW: '',
              errorTextD: '',
            })
            this.props.onRoomSizeChange(newSize)
          } else {
            const newSize = { ...this.state.size, width: toNumber(val), depth: toNumber(val) }
            this.setState({
              ...this.state,
              size: newSize,
              errorTextW: `Invalid: ${minSize} < W < ${maxSize}`,
              errorTextD: `Invalid: ${minSize} < D < ${maxSize}`,
            })
          }
        }
        // Not a Number
        else {
          const newSize = { ...this.state.size, width: val }
          this.setState({
            ...this.state,
            size: newSize,
            errorTextW: 'Invalid: NaN',
            errorTextD: 'Invalid: NaN',
          })
        }
      }
        // DEPTH
        else {
          // Empty string
          if (val.length === 0) {
            const newSize = { ...this.state.size, height: '' }
            this.setState({
              ...this.state,
              size: newSize,
              errorTextH: `Invalid: ${minSize} < H < ${maxSize}`,
            })
          }
          // Number
          else if (!isNaN(toNumber(val))) {
            if (val >= minSize && val <= maxSize) {
              const newSize = { ...this.state.size, height: toNumber(val) }
              this.setState({
                ...this.state,
                size: newSize,
                errorTextH: '',
              })
              this.props.onRoomSizeChange(newSize)
            } else {
              const newSize = { ...this.state.size, height: toNumber(val) }
              this.setState({
                ...this.state,
                size: newSize,
                errorTextH: `Invalid: ${minSize} < H < ${maxSize}`,
              })
            }
          }
          // Not a Number
          else {
            const newSize = { ...this.state.size, height: val }
            this.setState({
              ...this.state,
              size: newSize,
              errorTextH: 'Invalid: NaN',
            })
          }
        }
    }
    // RECTANGULAR
    else {
      // WIDTH
      if (event.target.id === 'width') {
        // Empty string
        if (val.length === 0) {
          const newSize = { ...this.state.size, width: '' }
          this.setState({
            ...this.state,
            size: newSize,
            errorTextW: `Invalid: ${minSize} < W < ${maxSize}`,
          })
        }
        // Number
        else if (!isNaN(toNumber(val))) {
          if (val >= minSize && val <= maxSize) {
            const newSize = { ...this.state.size, width: toNumber(val) }
            this.setState({
              ...this.state,
              size: newSize,
              errorTextW: '',
            })
            this.props.onRoomSizeChange(newSize)
          } else {
            const newSize = { ...this.state.size, width: toNumber(val) }
            this.setState({
              ...this.state,
              size: newSize,
              errorTextW: `Invalid: ${minSize} < W < ${maxSize}`,
            })
          }
        }
        // Not a Number
        else {
          const newSize = { ...this.state.size, width: val }
          this.setState({
            ...this.state,
            size: newSize,
            errorTextW: 'Invalid: NaN',
          })
        }
      }
      // DEPTH
      else if (event.target.id === 'depth') {
        // Empty string
        if (val.length === 0) {
          const newSize = { ...this.state.size, depth: '' }
          this.setState({
            ...this.state,
            size: newSize,
            errorTextD: `Invalid: ${minSize} < D < ${maxSize}`,
          })
        }
        // Number
        else if (!isNaN(toNumber(val))) {
          if (val >= minSize && val <= maxSize) {
            const newSize = { ...this.state.size, depth: toNumber(val) }
            this.setState({
              ...this.state,
              size: newSize,
              errorTextD: '',
            })
            this.props.onRoomSizeChange(newSize)
          } else {
            const newSize = { ...this.state.size, depth: toNumber(val) }
            this.setState({
              ...this.state,
              size: newSize,
              errorTextD: `Invalid: ${minSize} < D < ${maxSize}`,
            })
          }
        }
        // Not a Number
        else {
          const newSize = { ...this.state.size, depth: val }
          this.setState({
            ...this.state,
            size: newSize,
            errorTextD: 'Invalid: NaN',
          })
        }
      }
      // HEIGHT
      else {
        // Empty string
        if (val.length === 0) {
          const newSize = { ...this.state.size, height: '' }
          this.setState({
            ...this.state,
            size: newSize,
            errorTextH: `Invalid: ${minSize} < H < ${maxSize}`,
          })
        }
        // Number
        else if (!isNaN(toNumber(val))) {
          if (val >= minSize && val <= maxSize) {
            const newSize = { ...this.state.size, height: toNumber(val) }
            this.setState({
              ...this.state,
              size: newSize,
              errorTextH: '',
            })
            this.props.onRoomSizeChange(newSize)
          } else {
            const newSize = { ...this.state.size, height: toNumber(val) }
            this.setState({
              ...this.state,
              size: newSize,
              errorTextH: `Invalid: ${minSize} < H < ${maxSize}`,
            })
          }
        }
        // Not a Number
        else {
          const newSize = { ...this.state.size, height: val }
          this.setState({
            ...this.state,
            size: newSize,
            errorTextH: 'Invalid: NaN',
          })
        }
      }
    }
  }

  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <React.Fragment>
        <H2>ROOM SIZE</H2>

        <PaddedFormControl fullWidth error={this.state.errorTextW !== ''}>
          <TextField
            id="width"
            type="text"
            value={this.state.size.width}
            label="Width (m)"
            fullWidth
            onChange={this.handleTextFieldChange}
          />
          {this.state.errorTextW !== '' && (
            <FormHelperText>{this.state.errorTextW}</FormHelperText>
          )}
        </PaddedFormControl>

        <PaddedFormControl fullWidth error={this.state.errorTextD !== ''}>
          <TextField
            id="depth"
            type="text"
            value={this.state.size.depth}
            label="Depth (m)"
            fullWidth
            onChange={this.handleTextFieldChange}
          />
          {this.state.errorTextD !== '' && (
            <FormHelperText>{this.state.errorTextD}</FormHelperText>
          )}
        </PaddedFormControl>

        <PaddedFormControl fullWidth error={this.state.errorTextH !== ''}>
          <TextField
            id="height"
            type="text"
            value={this.state.size.height}
            label="Height (m)"
            fullWidth
            onChange={this.handleTextFieldChange}
          />
          {this.state.errorTextH !== '' && (
            <FormHelperText>{this.state.errorTextH}</FormHelperText>
          )}
        </PaddedFormControl>
      </React.Fragment>
    )
  }
}

RoomSizeTextFields.propTypes = {
  roomSize: PropTypes.object.isRequired,
  roomShape: PropTypes.oneOf(values(RoomShape)).isRequired,
  onRoomSizeChange: PropTypes.func.isRequired,
}

RoomSizeTextFields.defaultProps = {
  roomShape: RoomShape.RECTANGULAR,
}

const mapStateToProps = state => ({
  roomSize: state.room.size,
  roomShape: state.room.shape,
})

const mapDispatchToProps = dispatch => ({
  onRoomSizeChange: size => dispatch(setRoomSize(size)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoomSizeTextFields)
