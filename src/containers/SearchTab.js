import React, { Component, Fragment } from 'react'

import SearchAudioAssetContainer from 'src/containers/SearchAudioAssetContainer'
import { FieldGroup, PanelContents } from 'src/styles/elements'
/* ========================================================================== */

/* ========================================================================== */
/* SEARCH TAB */
/* ========================================================================== */
class SearchTab extends Component {
  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <PanelContents>
        <FieldGroup>
          <SearchAudioAssetContainer />
        </FieldGroup>
      </PanelContents>
    )
  }
}

export default SearchTab
