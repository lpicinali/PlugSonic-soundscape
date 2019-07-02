import React, { Component } from 'react'

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
        <SourceUploader />
      </React.Fragment>
    )
  }
}

export default AddSourceTab
