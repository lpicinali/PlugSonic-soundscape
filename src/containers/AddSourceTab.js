import React, { Component} from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { map } from 'lodash'
import * as colors from 'src/styles/colors'

import SourceUploader from 'src/components/SourceUploader'

/* ========================================================================== */

/* ========================================================================== */
/* ADD SOURCE TAB */
/* ========================================================================== */
class AddSourceTab extends Component {

  /* ------------------------------------------------------------------------ */
  render() {

    return (
      <React.Fragment>
        <SourceUploader/>
      </React.Fragment>

    )
  }
}

export default AddSourceTab
