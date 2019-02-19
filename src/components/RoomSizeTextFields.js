import React, { Component} from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'
import * as colors from 'src/styles/colors'
import { values, toNumber, isNaN } from 'lodash'

import {H2} from 'src/styles/elements'

import TextField from 'material-ui/TextField'

import { setRoomSize } from 'src/actions/room.actions'
import { RoomShape } from 'src/constants.js'
/* ========================================================================== */
const minSize = 3
const maxSize = 100
/* ========================================================================== */
export const style = {
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
/* ROOM SIZE TEXT FIELDS */
/* ========================================================================== */
class RoomSizeTextFields extends Component {

  state = {
    size: { width: 30, depth: 20, height: 4 },
    errorTextW: '',
    errorTextD: '',
    errorTextH: '',
  }

  handleTextFieldChange = event => {
    const val = event.target.value
    // ROUND
    if (this.props.roomShape === RoomShape.ROUND) {
      // Empty string
      if (val.length === 0) {
        const newSize = { width: '', depth: '' }
        this.setState({
          ...this.state,
          size: newSize,
          errorTextW: `Invalid: ${minSize} < W < ${maxSize}`,
          errorTextD: '',
        })
      }
      // Number
      else if (!isNaN(toNumber(val))) {
        if (val >= minSize && val <= maxSize) {
          const newSize = { width: toNumber(val), depth: toNumber(val) }
          this.setState({
            ...this.state,
            size: newSize,
            errorTextW: '',
            errorTextD: '',
          })
          this.props.onRoomSizeChange(newSize)
        } else {
          const newSize = { width: toNumber(val), depth: toNumber(val) }
          this.setState({
            ...this.state,
            size: newSize,
            errorTextW: `Invalid: ${minSize} < W < ${maxSize}`,
            errorTextD: '',
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
          errorTextD: '',
        })
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
    console.log(this.state.errorTextW)
    return (
      <React.Fragment>
        <H2>ROOM SIZE</H2>
        <TextField
          id="width"
          type="text"
          value={this.state.size.width}
          errorText={this.state.errorTextW}
          floatingLabelFixed
          // floatingLabelFocusStyle={tfFloatingLabelFocusStyle}
          // floatingLabelStyle={tfFloatingLabelStyle}
          floatingLabelText="Width (m)"
          onChange={this.handleTextFieldChange}
          // inputStyle={tfInputStyle}
          style={style}
          underlineFocusStyle={underlineFocusStyle}
          underlineStyle={underlineStyle}
        />

        <TextField
          id="depth"
          type="text"
          value={this.state.size.depth}
          errorText={this.state.errorTextD}
          floatingLabelFixed
          // floatingLabelFocusStyle={tfFloatingLabelFocusStyle}
          // floatingLabelStyle={tfFloatingLabelStyle}
          floatingLabelText="Depth (m)"
          onChange={this.handleTextFieldChange}
          // inputStyle={tfInputStyle}
          style={style}
          underlineFocusStyle={underlineFocusStyle}
          underlineStyle={underlineStyle}
        />

        <TextField
          id="height"
          type="text"
          value={this.state.size.height}
          errorText={this.state.errorTextH}
          floatingLabelFixed
          // floatingLabelFocusStyle={tfFloatingLabelFocusStyle}
          // floatingLabelStyle={tfFloatingLabelStyle}
          floatingLabelText="Height (m)"
          onChange={this.handleTextFieldChange}
          // inputStyle={tfInputStyle}
          style={style}
          underlineFocusStyle={underlineFocusStyle}
          underlineStyle={underlineStyle}
        />
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
  roomSize: { width: 30, depth: 20, height: 4 },
  roomShape: RoomShape.RECTANGULAR,
}

const mapStateToProps = state => ({
  roomSize: state.room.size,
  roomShape: state.room.shape,
})

const mapDispatchToProps = dispatch => ({
  onRoomSizeChange: size => dispatch(setRoomSize(size)),
})

export default connect(mapStateToProps,mapDispatchToProps)(RoomSizeTextFields)
