import React, { Component } from 'react'

import { Tabs, Tab } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Add from '@material-ui/icons/Add'
import Search from '@material-ui/icons/Search'
import Sources from '@material-ui/icons/QueueMusic'
import Room from '@material-ui/icons/AspectRatio'
import Listener from '@material-ui/icons/Hearing'
import Exhibition from '@material-ui/icons/Save'

import AddSourceTab from 'src/containers/AddSourceTab'
import SearchTab from 'src/containers/SearchTab'
import RoomTab from 'src/containers/RoomTab'
import SourcesTab from 'src/containers/SourcesTab'
import ListenerTab from 'src/containers/ListenerTab'
import ExhibitionTab from 'src/containers/ExhibitionTab'

import * as colors from 'src/styles/colors.js'

const BlackTabs = withStyles({
  root: {
    backgroundColor: colors.BLACK,
  },
  indicator: {
    backgroundColor: colors.WHITE,
  },
})(Tabs)

const NarrowTab = withStyles({
  root: {
    flexGrow: 1,
    minWidth: 0,
  },
})(Tab)

/* ========================================================================== */
/* TABS */
/* ========================================================================== */
class TabsContainer extends Component {
  state = {
    value: 5,
  }

  handleChange = (event, value) => {
    this.setState({ ...this.state, value })
  }

  render() {
    const { value } = this.state

    return (
      <div>
        <BlackTabs value={value} onChange={this.handleChange}>
          <NarrowTab icon={<Add color="secondary" />} />
          <NarrowTab icon={<Search color="secondary" />} />
          <NarrowTab icon={<Sources color="secondary" />} />
          <NarrowTab icon={<Room color="secondary" />} />
          <NarrowTab icon={<Listener color="secondary" />} />
          <NarrowTab icon={<Exhibition color="secondary" />} />
        </BlackTabs>

        {value === 0 && <AddSourceTab />}
        {value === 1 && <SearchTab />}
        {value === 2 && <SourcesTab />}
        {value === 3 && <RoomTab />}
        {value === 4 && <ListenerTab />}
        {value === 5 && <ExhibitionTab />}
      </div>
    )
  }
}

export default TabsContainer
