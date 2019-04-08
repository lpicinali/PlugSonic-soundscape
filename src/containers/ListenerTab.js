import React, { Component } from 'react'

import SpatializationModeToggle from 'src/components/SpatializationModeToggle'
import HeadCircumferenceSlider from 'src/components/HeadCircumferenceSlider'
import HrtfSelect from 'src/components/HrtfSelect.js'

/* ========================================================================== */
/* LISTENER TAB */
/* ========================================================================== */
class ListenerTab extends Component {
  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <React.Fragment>
        <SpatializationModeToggle />
        <HeadCircumferenceSlider />
        <HrtfSelect />
      </React.Fragment>
    )
  }
}

export default ListenerTab
