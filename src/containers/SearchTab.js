import React, { Component} from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { map } from 'lodash'
import * as colors from 'src/styles/colors'

import SearchTextField from 'src/components/SearchTextField'
/* ========================================================================== */

/* ========================================================================== */
/* SEARCH TAB */
/* ========================================================================== */
class SearchTab extends Component {

  /* ------------------------------------------------------------------------ */
  render() {

    return (
      <React.Fragment>
        <SearchTextField/>
      </React.Fragment>
    )
  }
}

export default SearchTab
