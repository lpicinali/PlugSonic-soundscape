import React, { Component} from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { map } from 'lodash'
import * as colors from 'src/styles/colors'

import SourceUploader from 'src/components/SourceUploader'

/* ========================================================================== */

/* ========================================================================== */
/* ROOM TAB */
/* ========================================================================== */
class RoomTab extends Component {

  /* ------------------------------------------------------------------------ */
  render() {

    return (
      <React.Fragment>
        <SourceUploader/>
        {/* <SourceTextFields/> */}
        {/* <AddSourceButton/> */}
      </React.Fragment>

    )
  }
}

export default RoomTab
