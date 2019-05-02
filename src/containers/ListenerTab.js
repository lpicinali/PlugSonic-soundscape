import React, { Component } from 'react'

import SpatializationModeToggle from 'src/components/SpatializationModeToggle'
import HeadCircumferenceSlider from 'src/components/HeadCircumferenceSlider'
import HrtfSelect from 'src/components/HrtfSelect.js'
import { FieldGroup, PanelContents } from 'src/styles/elements.js'

/* ========================================================================== */
/* LISTENER TAB */
/* ========================================================================== */
class ListenerTab extends Component {
  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <PanelContents>
        <SpatializationModeToggle />

        <FieldGroup>
          <HeadCircumferenceSlider />
        </FieldGroup>

        <HrtfSelect />
      </PanelContents>
    )
  }
}

export default ListenerTab
