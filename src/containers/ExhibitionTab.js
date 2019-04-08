import React, { Component} from "react"
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
