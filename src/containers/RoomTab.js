import React, { Component} from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'
import * as colors from 'src/styles/colors'

import RoomShapeDropDownMenu from 'src/components/RoomShapeDropDownMenu'
import RoomSizeTextFields from 'src/components/RoomSizeTextFields'
/* ========================================================================== */

/* ========================================================================== */
/* ROOM TAB */
/* ========================================================================== */
class RoomTab extends Component {

  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <React.Fragment>
        <RoomShapeDropDownMenu/>
        <RoomSizeTextFields/>
        {/* <Uploader/> */}
        {/* <ResetPosition/> */}
      </React.Fragment>

    )
  }
}

export default RoomTab
