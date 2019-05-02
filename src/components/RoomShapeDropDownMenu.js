import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { values } from 'lodash'
import { MenuItem } from '@material-ui/core'

import { RoomShape } from 'src/constants.js'
import { setRoomShape, setRoomSize } from 'src/actions/room.actions.js'
import { FullWidthSelect, H2 } from 'src/styles/elements.js'

/* ========================================================================== */
/* ROOM SHAPE DROPDOWN MENU */
/* ========================================================================== */
class RoomShapeDropDownMenu extends Component {
  handleChange = (evt) => {
    const { value } = evt.target

    this.props.onRoomShapeChange(value)
    if (value === RoomShape.ROUND) {
      const newSize = {
        width: this.props.roomSize.width,
        depth: this.props.roomSize.width,
      }
      this.props.onRoomSizeChange(newSize)
    }
  }

  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <React.Fragment>
        <H2>ROOM SHAPE</H2>
        <FullWidthSelect value={this.props.roomShape} onChange={this.handleChange}>
          <MenuItem value={RoomShape.RECTANGULAR}>Rectangular</MenuItem>
          <MenuItem value={RoomShape.ROUND}>Round</MenuItem>
        </FullWidthSelect>
      </React.Fragment>
    )
  }
}

RoomShapeDropDownMenu.propTypes = {
  roomSize: PropTypes.object.isRequired,
  roomShape: PropTypes.oneOf(values(RoomShape)).isRequired,
  onRoomSizeChange: PropTypes.func.isRequired,
  onRoomShapeChange: PropTypes.func.isRequired,
}

RoomShapeDropDownMenu.defaultProps = {
  roomSize: { width: 30, depth: 20, height: 4 },
  roomShape: RoomShape.RECTANGULAR,
}

const mapStateToProps = state => ({
  roomSize: state.room.size,
  roomShape: state.room.shape,
})

const mapDispatchToProps = dispatch => ({
  onRoomSizeChange: size => dispatch(setRoomSize(size)),
  onRoomShapeChange: shape => dispatch(setRoomShape(shape)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoomShapeDropDownMenu)
