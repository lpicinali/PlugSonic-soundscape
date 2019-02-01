/* eslint no-unused-vars: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint react/prefer-stateless-function: 0 */
/* eslint no-lonely-if: 0 */
import React, {Component} from 'react'
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {Tabs, Tab} from 'material-ui/Tabs'
import Add from 'material-ui/svg-icons/content/add'
import Search from "material-ui/svg-icons/action/search"
import Sources from "material-ui/svg-icons/av/queue-music"
import Room from "material-ui/svg-icons/action/aspect-ratio"
import Listener from "material-ui/svg-icons/av/hearing"
import Soundscape from "material-ui/svg-icons/content/save"

import * as colors from 'src/styles/colors'

/* ========================================================================== */
/* TABS */
/* ========================================================================== */
class TabsContainer extends Component {

  state = {
    value: 'a',
  }

  handleChange = (value) => {
    this.setState({ ...this.state, value });
  };

  render() {
    return (
      <Tabs value={this.state.value} onChange={this.handleChange}>
        <Tab icon={<Add/>} value="a">
          <h2>Tab A</h2>
        </Tab>
        <Tab icon={<Search/>} value="b">
          <h2>Tab B</h2>
        </Tab>
        <Tab icon={<Sources/>} value="c">
          <h2>Tab A</h2>
        </Tab>
        <Tab icon={<Room/>} value="d">
          <h2>Tab B</h2>
        </Tab>
        <Tab icon={<Listener/>} value="e">
          <h2>Tab A</h2>
        </Tab>
        <Tab icon={<Soundscape/>} value="f">
          <h2>Tab B</h2>
        </Tab>
      </Tabs>
    )
  }
}

TabsContainer.propTypes = {
// width: PropTypes.number.isRequired,
// height: PropTypes.number.isRequired,
// showSettingsDrawer: PropTypes.bool.isRequired,
// roomWidth: PropTypes.number.isRequired,
// roomHeight: PropTypes.number.isRequired,
}

TabsContainer.defaultProps = {
// width: 0,
// height: 0,
// showSettingsDrawer: false,
// roomWidth: 0,
// roomHeight: 0,
}

const mapStateToProps = state => ({
// showSettingsDrawer: state.controls.showSettingsDrawer,
// roomWidth: state.room.size.width,
// roomHeight: state.room.size.height,
})

export default connect(null,null)(TabsContainer)
