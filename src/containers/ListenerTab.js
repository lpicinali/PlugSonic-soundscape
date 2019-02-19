import React, { Component} from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'
import * as colors from 'src/styles/colors'

import SpatializationModeToggle from 'src/components/SpatializationModeToggle'
import HeadCircumferenceSlider from 'src/components/HeadCircumferenceSlider'
/* ========================================================================== */
/* LISTENER TAB */
/* ========================================================================== */
class ListenerTab extends Component {

  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <React.Fragment>
        <SpatializationModeToggle/>
        <HeadCircumferenceSlider/>
        {/* <HrtfFunctionDropDownMenu/> */}
        {/* <HrtfLengthSlider/> */}
        {/* <AttenuationSlider/> */}
      </React.Fragment>

    )
  }
}

export default ListenerTab
