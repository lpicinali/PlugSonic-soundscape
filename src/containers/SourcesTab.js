import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { List } from '@material-ui/core'

import SourcePanel from 'src/containers/SourcePanel.js'

/* ========================================================================== */
/* SOURCES TAB */
/* ========================================================================== */
class SourcesTab extends Component {
  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <List>
        {map(this.props.sources, source => (
          <SourcePanel key={source.name} sourceObject={source} />
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

export default connect(
  mapStateToProps,
  null
)(SourcesTab)
