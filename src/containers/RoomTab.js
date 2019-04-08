import React, { Component } from 'react'

import RoomShapeDropDownMenu from 'src/components/RoomShapeDropDownMenu'
import RoomSizeTextFields from 'src/components/RoomSizeTextFields'
import ImageUploader from 'src/components/ImageUploader'
import ResetPositionButton from 'src/components/ResetPositionButton'
/* ========================================================================== */

/* ========================================================================== */
/* ROOM TAB */
/* ========================================================================== */
class RoomTab extends Component {
  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <React.Fragment>
        <RoomShapeDropDownMenu />
        <RoomSizeTextFields />
        <ImageUploader />
        <ResetPositionButton />
      </React.Fragment>
    )
  }
}

export default RoomTab
