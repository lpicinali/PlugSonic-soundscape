import React, { Component} from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'
import * as colors from 'src/styles/colors'

import { List, ListItem } from "material-ui/List"
import Divider from "material-ui/Divider"
import Toggle from 'material-ui/Toggle'

import { sourceOnOff } from 'src/actions/sources.actions'
/* ========================================================================== */
const toggleStyle = {
  margin: `auto`,
  marginTop: `20px`,
  width: `85%`,
}

const toggleLabelStyle = {
  fontSize: `14px`,
  textTransform: `uppercase`,
  letterSpacing: `1px`,
}
/* ========================================================================== */
/* SOURCES TAB */
/* ========================================================================== */
class SourcePanel extends Component {

  handleSourceOnOff = (name) => {
    this.props.onSourceOnOff(this.props.sourceObject.name)
  }
  /* ------------------------------------------------------------------------ */
  render() {

    const nestedItems = []

    nestedItems.push(
      <ListItem
        key={`${this.props.sourceObject.name}-onofftoggle`}
        primaryText="ON/OFF"
        rightToggle={
          <Toggle
            onToggle={() => this.props.onSourceOnOff(this.props.sourceObject.name)}
            toggled={this.props.sourceObject.selected}
          />
        }
      />
    )

    nestedItems.push(
      <ListItem
        key="item_2"
        primaryText="PrimaryText_2"
        secondaryText="SecondaryText_2"
      />
    )

    nestedItems.push(
      <ListItem
        key="item_3"
        primaryText="PrimaryText_3"
        secondaryText="SecondaryText_3"
      />
    )

    return (
      <ListItem
        key={this.props.sourceObject.name}
        primaryText={this.props.sourceObject.name}
        primaryTogglesNestedList
        nestedItems={nestedItems}
      />
    )
  }
}

SourcePanel.propTypes = {
  sourceObject: PropTypes.object.isRequired,
  onSourceOnOff: PropTypes.func.isRequired,
}

SourcePanel.defaultProps = {
  sourceObject: {},
}

const mapStateToProps = state => ({
  sources: state.sources.sources,
})

const mapDispatchToProps = dispatch => ({
  onSourceOnOff: name => dispatch(sourceOnOff(name)),
})

export default connect(mapStateToProps,mapDispatchToProps)(SourcePanel)
