import React, { Component} from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'
import * as colors from 'src/styles/colors'

import RoomShapeDropDownMenu from 'src/components/RoomShapeDropDownMenu'
import RoomSizeTextFields from 'src/components/RoomSizeTextFields'
import ImageUploader from 'src/components/ImageUploader'
import ResetPosition from 'src/components/ResetPosition'
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
        <ImageUploader/>
        <ResetPosition/>
      </React.Fragment>

    )
  }
}

export default RoomTab
