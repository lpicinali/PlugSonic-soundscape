import React, { Component} from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import * as colors from 'src/styles/colors'
import { values } from 'lodash'

import {H2} from 'src/styles/elements'

import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'

import { RoomShape } from 'src/constants.js'
import { setRoomShape, setRoomSize } from 'src/actions/room.actions'
/* ========================================================================== */
const DropDownMenuStyle = {
  width: '100%'
}
const IconStyle = {
  fill: colors.BLACK
}
const UnderlineStyle = {
  borderTop: `solid 1px ${colors.BLACK}`,
}
/* ========================================================================== */
/* ROOM SHAPE DROPDOWN MENU */
/* ========================================================================== */
class RoomShapeDropDownMenu extends Component {

  handleChange = (event, index, value) => {
    this.props.onRoomShapeChange(value)
    if (value === RoomShape.ROUND) {
      const newSize = { width: this.props.roomSize.width, depth: this.props.roomSize.width }
      this.props.onRoomSizeChange(newSize)
    }
  }

  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <React.Fragment>
        <H2>ROOM SHAPE</H2>
        <DropDownMenu
          style={DropDownMenuStyle}
          iconStyle={IconStyle}
          underlineStyle={UnderlineStyle}
          value={this.props.roomShape}
          onChange={this.handleChange}>
          <MenuItem value={RoomShape.RECTANGULAR} primaryText="Rectangular" />
          <MenuItem value={RoomShape.ROUND} primaryText="Round" />
        </DropDownMenu>
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
  onRoomShapeChange: shape => dispatch(setRoomShape(shape))
})

export default connect(mapStateToProps,mapDispatchToProps)(RoomShapeDropDownMenu)
