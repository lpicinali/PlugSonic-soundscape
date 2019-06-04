import React, { Component} from 'react'
// import { Divider } from '@material-ui/core'

import ExhibitionContainer from 'src/containers/ExhibitionContainer'
// import ImportButton from 'src/components/ImportButton'
// import ExportMetaButton from 'src/components/ExportMetaButton'
// import ExportRawButton from 'src/components/ExportRawButton'
import {
  // FieldBox,
  // FieldGroup,
  // H2,
  PanelContents
} from 'src/styles/elements'

/* ========================================================================== */
/* EXHIBITION TAB */
/* ========================================================================== */
class ExhibitionTab extends Component {

  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <React.Fragment>
        <PanelContents>
          <ExhibitionContainer/>
        </PanelContents>

        {/* <Divider /> */}

        {/* <PanelContents>
          <FieldGroup>
            <H2>IMPORT</H2>
            <ImportButton/>
          </FieldGroup>

          <FieldGroup>
            <H2>EXPORT</H2>
            <FieldBox>
          <ExportMetaButton/>
            </FieldBox>
            <FieldBox>
          <ExportRawButton/>
            </FieldBox>
          </FieldGroup>
        </PanelContents> */}
      </React.Fragment>
    )
  }
}

export default ExhibitionTab
