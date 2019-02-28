import React, { Component} from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'

import * as colors from 'src/styles/colors'
import {H2} from 'src/styles/elements'

import ExhibitionContainer from 'src/containers/ExhibitionContainer'
import ImportButton from 'src/components/ImportButton'
import ExportMetaButton from 'src/components/ExportMetaButton'
import ExportRawButton from 'src/components/ExportRawButton'
/* ========================================================================== */
/* EXHIBITION TAB */
/* ========================================================================== */
class ExhibitionTab extends Component {

  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <React.Fragment>
        <ExhibitionContainer/>
        <H2>IMPORT</H2>
        <ImportButton/>
        <H2>EXPORT</H2>
        <ExportMetaButton/>
        <ExportRawButton/>
      </React.Fragment>

    )
  }
}

export default ExhibitionTab
