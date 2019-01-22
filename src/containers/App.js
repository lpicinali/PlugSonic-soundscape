/* eslint no-unused-expressions: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint no-unused-vars: 0 */
/* eslint react/forbid-prop-types: 0 */
/* global location */
/* eslint no-restricted-globals: 0 */
/* eslint react/prefer-stateless-functions: 0 */
import React, { PureComponent, Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'

import ContainerDimensions from 'react-container-dimensions'

import MuiThemeProviderOld from 'material-ui/styles/MuiThemeProvider'
// import MuiThemeProviderNew from '@material-ui/core/styles/MuiThemeProvider'
// import MenuItem from 'material-ui/MenuItem'
// import TextField from 'material-ui/TextField';

import { BLACK, BLUE, DARKGRAY, GRAY, LIGHTGRAY, TURQOISE, WHITE } from 'src/styles/colors.js'

// import PositionControllerContainer from 'src/containers/PositionControllerContainer'
// import TargetSelectorContainer from 'src/containers/TargetSelectorContainer'
// import ListenerOptionsContainer from 'src/containers/ListenerOptionsContainer'
// import ImportExportContainer from 'src/containers/ImportExportContainer'
// import ArrowControlsContainer from 'src/containers/ArrowControlsContainer'
// import Disclaimer from 'src/containers/Disclaimer.js'
import {
  // Heading,
  // Instructions,
  // Logo,
  AppContent,
  ArrowsContainer,
  FixedContainer,
  GlobalStyle,
  Header,
  MasterVolContainer,
  PlaybackContainer,
  PositionController,
  ScapeContainer,
  ScrollContainer,
  SettingsDrawer,
  SettingsIconContainer,
} from 'src/containers/App.style'
// import { H2, H3 } from 'src/styles/elements.js'

class App extends Component {
  static propTypes = {
    hasReadDisclaimer: PropTypes.bool.isRequired,
  }

  state = {
    showSettingsDrawer: false,
    showArrowsDrawer: false
  }

  handleSettingsDrawer() {
    this.setState({...this.state, showSettingsDrawer: !this.state.showSettingsDrawer })
  }

  handleArrowsDrawer() {
    this.setState({...this.state, showArrowsDrawer: !this.state.showArrowsDrawer })
  }

  render() {
    const { hasReadDisclaimer } = this.props

    return (
      <MuiThemeProviderOld>
        <React.Fragment>
          <GlobalStyle />
          <AppContent>

            {/* <Header> Header </Header> */}

            <ScapeContainer showSettingsDrawer={this.state.showSettingsDrawer}>
              <ContainerDimensions>
                { ({width,height}) => <PositionController width={width} height={height}/> }
              </ContainerDimensions>
            </ScapeContainer>

            <MasterVolContainer showSettingsDrawer={this.state.showSettingsDrawer} showArrowsDrawer={this.state.showArrowsDrawer}> Master Vol Container </MasterVolContainer>

            <PlaybackContainer showSettingsDrawer={this.state.showSettingsDrawer} showArrowsDrawer={this.state.showArrowsDrawer}> Playback Container </PlaybackContainer>
            <SettingsIconContainer onClick={() => {this.handleSettingsDrawer()}}>
              Settings Icon
            </SettingsIconContainer>

            <ArrowsContainer
              onClick={() => {this.handleArrowsDrawer()}}
              showArrowsDrawer={this.state.showArrowsDrawer}
            >
              Arrows Container
            </ArrowsContainer>

            <SettingsDrawer showSettingsDrawer={this.state.showSettingsDrawer}>
              Settings Drawer
            </SettingsDrawer>

          </AppContent>
        </React.Fragment>

      </MuiThemeProviderOld>
    )
  }
}

export default connect(state => ({
  hasReadDisclaimer: state.alerts.hasReadDisclaimer,
}))(App)
