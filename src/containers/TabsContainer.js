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
import Exhibition from "material-ui/svg-icons/content/save"

import AddSourceTab from 'src/containers/AddSourceTab'
import SearchTab from 'src/containers/SearchTab'
import RoomTab from 'src/containers/RoomTab'
import SourcesTab from 'src/containers/SourcesTab'
import ListenerTab from 'src/containers/ListenerTab'
import ExhibitionTab from 'src/containers/ExhibitionTab'

/* ========================================================================== */
/* TABS */
/* ========================================================================== */
class TabsContainer extends Component {

  state = {
    value: 'search',
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
          <SearchTab/>
        </Tab>

        <Tab icon={<Sources/>} value="sources">
          <SourcesTab/>
        </Tab>

        <Tab icon={<Room/>} value="room">
          <RoomTab/>
        </Tab>

        <Tab icon={<Listener/>} value="listener">
          <ListenerTab/>
        </Tab>

        <Tab icon={<Exhibition/>} value="exhibition">
          <ExhibitionTab/>
        </Tab>
      </Tabs>
    )
  }
}

export default TabsContainer
