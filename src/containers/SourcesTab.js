import React, { Component} from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'
import * as colors from 'src/styles/colors'
import { map } from 'lodash'

import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import SourcePanel from 'src/containers/SourcePanel'
/* ========================================================================== */

/* ========================================================================== */
/* SOURCES TAB */
/* ========================================================================== */
class SourcesTab extends Component {


  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <List>
        {map(this.props.sources, source => (
          <span key={source.name}>
            <SourcePanel sourceObject={source}/>
            <Divider/>
          </span>
        ))}
      </List>
    )
  }
}

SourcesTab.propTypes = {
  sources: PropTypes.object.isRequired,
}

SourcesTab.defaultProps = {
  sources: {},
}

const mapStateToProps = state => ({
  sources: state.sources.sources,
})

export default connect(mapStateToProps,null)(SourcesTab)
