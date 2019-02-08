import React, {Component} from 'react'
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'
import * as colors from 'src/styles/colors'

import {Tabs, Tab} from 'material-ui/Tabs'
import Add from 'material-ui/svg-icons/content/add'
import Search from "material-ui/svg-icons/action/search"
import Sources from "material-ui/svg-icons/av/queue-music"
import Room from "material-ui/svg-icons/action/aspect-ratio"
import Listener from "material-ui/svg-icons/av/hearing"
import Soundscape from "material-ui/svg-icons/content/save"

import AddSourceTab from 'src/containers/AddSourceTab'
import RoomTab from 'src/containers/RoomTab'
import ListenerTab from 'src/containers/ListenerTab'
/* ========================================================================== */
/* TABS */
/* ========================================================================== */
class TabsContainer extends Component {

  state = {
    value: 'add',
  }

  handleChange = (value) => {
    this.setState({ ...this.state, value })
  }

  render() {
    return (
      <Tabs value={this.state.value} onChange={this.handleChange}>
        <Tab icon={<Add/>} value="add">
          <AddSourceTab/>
        </Tab>

        <Tab icon={<Search/>} value="search">
          <h2>Tab B</h2>
        </Tab>

        <Tab icon={<Sources/>} value="sources">
          <h2>Tab A</h2>
        </Tab>

        <Tab icon={<Room/>} value="room">
          <RoomTab/>
        </Tab>

        <Tab icon={<Listener/>} value="listener">
          <ListenerTab/>
        </Tab>

        <Tab icon={<Soundscape/>} value="soundscape">
          <h2>Tab B</h2>
        </Tab>
      </Tabs>
    )
  }
}

export default TabsContainer
