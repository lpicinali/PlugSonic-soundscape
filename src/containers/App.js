/* eslint no-unused-expressions: 0 */
/* global location */
/* eslint no-restricted-globals: 0 */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"

import PositionControllerContainer from 'src/containers/PositionControllerContainer.js'
import TargetSelectorContainer from 'src/containers/TargetSelectorContainer.js'
import ListenerOptionsContainer from 'src/containers/ListenerOptionsContainer.js'
import ImportExportContainer from 'src/containers/ImportExportContainer.js'
// import Disclaimer from 'src/containers/Disclaimer.js'
import { Header, HeaderContent, Heading, Logo, Instructions, AppContent } from 'src/containers/App.style'
import { H2, H3 } from 'src/styles/elements.js'

class App extends PureComponent {
  static propTypes = {
    hasReadDisclaimer: PropTypes.bool.isRequired,
  }

  render() {
    const { hasReadDisclaimer } = this.props

    return (
      <MuiThemeProvider>
        <div>
          <Header>
            <HeaderContent>
              {/* <div style={{ width: `50%` }}>PlugSonic Demo</div> */}
              <Heading>PlugSonic - Create</Heading>
              <Logo src={`${location.origin}/assets/img/pluggy_final_logo_RGB_small.png`} alt=""/>
            </HeaderContent>
          </Header>

          {/* <Disclaimer isRead={hasReadDisclaimer} /> */}

          <AppContent>
            <div style={{ display: 'flex', flexWrap: 'wrap', flex: '0 1 33.333%' }}>
              <TargetSelectorContainer />
            </div>

            <div style={{ flex: '0 1 33.333%' }}>
              <H2>Soundscape</H2>
              <H3>Position</H3>
              <Instructions>- mouse to move sources</Instructions>
              <Instructions style={{ marginBottom: `8px` }}>- mouse/arrow-keys to move listener</Instructions>
              <PositionControllerContainer />
            </div>

            <div style={{ flex: '0 1 33.333%' }}>
              <ListenerOptionsContainer />
              <ImportExportContainer />
            </div>
          </AppContent>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default connect(state => ({
  hasReadDisclaimer: state.alerts.hasReadDisclaimer,
}))(App)
