import React, { Component} from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { map } from 'lodash'
import * as colors from 'src/styles/colors'

import SearchAssetContainer from 'src/containers/SearchAssetContainer'
/* ========================================================================== */

/* ========================================================================== */
/* SEARCH TAB */
/* ========================================================================== */
class SearchTab extends Component {

  /* ------------------------------------------------------------------------ */
  render() {

    return (
      <React.Fragment>
        <SearchAssetContainer/>
      </React.Fragment>
    )
  }
}

export default SearchTab
