/* eslint no-unused-expressions: 0 */
/* global location */
/* eslint no-restricted-globals: 0 */
import React, { PureComponent } from 'react'
// import { Provider } from 'react-redux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled, { injectGlobal } from 'styled-components'
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
// import store from 'src/store.js'
import PlaybackControlsContainer from 'src/containers/PlaybackControlsContainer.js'
import PositionControllerContainer from 'src/containers/PositionControllerContainer.js'
import TargetSelectorContainer from 'src/containers/TargetSelectorContainer.js'
import ListenerOptionsContainer from 'src/containers/ListenerOptionsContainer.js'
import ImportExportContainer from 'src/containers/ImportExportContainer.js'
import Disclaimer from 'src/containers/Disclaimer.js'
import { BLUE, GRAY } from 'src/styles/colors.js'
import { H2, H3, H4 } from 'src/styles/elements.js'
import { MAX_WIDTH } from 'src/styles/layout.js'

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,700');

  html, body {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Roboto', sans-serif;
  }
`

const Header = styled.header`
  background: ${BLUE};
  color: #fefefe;
`

const HeaderContent = styled.div`
  padding: 32px 16px 32px;
  width: 100%;
  max-width: ${MAX_WIDTH}px;
  margin: 0 auto;
`

const Heading = styled.h1`
  margin: 0;
  font-size: 24px;
  line-height: 32px;
  display: inline-block;
`
const Logo = styled.img`
  max-height: 80px;
  max-width: ${MAX_WIDTH}px;
  margin-top: -24px;
  padding-right: 16px;
  float: right;
  ${'' /* padding: 16px 32px; */}
`

export const Instructions = styled.p`
  color: ${GRAY};
  font-size: 12px;
  margin: 0px 0px;
`

const AppContent = styled.div`
  display: flex;
  width: 100%;
  max-width: ${MAX_WIDTH}px;
  margin: 0 auto;
  padding: 24px 16px;
`

// export default function App() {
class App extends PureComponent {
  static propTypes = {
    hasReadDisclaimer: PropTypes.bool.isRequired,
  }

  render() {
    const { hasReadDisclaimer } = this.props

    return (
      // <Provider store={store}>
        <MuiThemeProvider>
          <div>
            <Header>
              <HeaderContent>
                {/* <div style={{ width: `50%` }}>PlugSonic Demo</div> */}
                <Heading>PlugSonic - Create</Heading>
                <Logo src={`${location.origin}/assets/img/pluggy_final_logo_RGB_small.png`} alt=""/>
              </HeaderContent>
            </Header>

            <Disclaimer isRead={hasReadDisclaimer} />

            <AppContent>
              {/* <PlaybackControlsContainer /> */}

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
      // </Provider>
    )
  }
}

export default connect(state => ({
  hasReadDisclaimer: state.alerts.hasReadDisclaimer,
}))(App)
