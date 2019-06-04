import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Tabs, Tab } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
// import Add from '@material-ui/icons/Add'
import Search from '@material-ui/icons/Search'
import Sources from '@material-ui/icons/QueueMusic'
import Room from '@material-ui/icons/AspectRatio'
import Listener from '@material-ui/icons/Hearing'
import Exhibition from '@material-ui/icons/Save'

import { selectTab } from 'src/actions/navigation.actions.js'
// import AddSourceTab from 'src/containers/AddSourceTab'
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
  static propTypes = {
    currentTabIndex: PropTypes.number.isRequired,
    onSelectTab: PropTypes.func.isRequired,
  }

  handleChange = (event, value) => {
    this.props.onSelectTab(value)
  }

  render() {
    const { currentTabIndex } = this.props

    return (
      <div>
        <BlackTabs value={currentTabIndex} onChange={this.handleChange}>
          {/* <NarrowTab icon={<Add color="secondary" />} /> */}
          {/* <NarrowTab icon={<Search color="secondary" />} /> */}
          {/* <NarrowTab icon={<Sources color="secondary" />} /> */}
          {/* <NarrowTab icon={<Room color="secondary" />} /> */}
          <NarrowTab icon={<Listener color="secondary" />} />
          <NarrowTab icon={<Exhibition color="secondary" />} />
        </BlackTabs>

        {/* {currentTabIndex === 0 && <AddSourceTab />} */}
        {/* {currentTabIndex === 0 && <SearchTab />} */}
        {/* {currentTabIndex === 1 && <SourcesTab />} */}
        {/* {currentTabIndex === 2 && <RoomTab />} */}
        {currentTabIndex === 0 && <ListenerTab />}
        {currentTabIndex === 1 && <ExhibitionTab />}
      </div>
    )
  }
}

export default connect(
  state => ({
    currentTabIndex: state.navigation.currentTabIndex,
  }),
  dispatch => ({
    onSelectTab: tabIndex => dispatch(selectTab(tabIndex)),
  })
)(TabsContainer)
