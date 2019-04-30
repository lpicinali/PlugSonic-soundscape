import React, { Component } from 'react'

import RoomShapeDropDownMenu from 'src/components/RoomShapeDropDownMenu'
import RoomSizeTextFields from 'src/components/RoomSizeTextFields'
import ImageUploader from 'src/components/ImageUploader'
import ResetPositionButton from 'src/components/ResetPositionButton'
import { FieldGroup, PanelContents } from 'src/styles/elements'

/* ========================================================================== */

/* ========================================================================== */
/* ROOM TAB */
/* ========================================================================== */
class RoomTab extends Component {
  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <PanelContents>
        <FieldGroup>
          <RoomShapeDropDownMenu />
        </FieldGroup>
        <FieldGroup>
          <RoomSizeTextFields />
        </FieldGroup>
        <FieldGroup>
          <ImageUploader />
        </FieldGroup>
        <FieldGroup>
          <ResetPositionButton />
        </FieldGroup>
      </PanelContents>
    )
  }
}

export default RoomTab
