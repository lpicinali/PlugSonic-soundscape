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

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField';

import { BLACK, BLUE, DARKGRAY, GRAY, LIGHTGRAY, TURQOISE, WHITE } from 'src/styles/colors.js'

import PositionControllerContainer from 'src/containers/PositionControllerContainer'
import TargetSelectorContainer from 'src/containers/TargetSelectorContainer'
import ListenerOptionsContainer from 'src/containers/ListenerOptionsContainer'
import ImportExportContainer from 'src/containers/ImportExportContainer'
import ArrowControlsContainer from 'src/containers/ArrowControlsContainer'
// import Disclaimer from 'src/containers/Disclaimer.js'
import {
  Header,
  Heading,
  Logo,
  Instructions,
  AppContent,
  EmptyColumn,
  FirstColumn,
  SecondColumn,
  ThirdColumn,
} from 'src/containers/App.style'
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
            <Heading>PlugSonic - Create</Heading>
            <Logo src={`${location.origin}/assets/img/pluggy_final_logo_RGB_small.png`} alt="" />
          </Header>

          <AppContent>

            <FirstColumn>
              <H2>Sources</H2>
              <H3 style={{marginTop: `16px`}}>Add Source</H3>
              <TargetSelectorContainer />
            </FirstColumn>

            <EmptyColumn />

            <SecondColumn>
              <H2 style={{ paddingBottom: `16px` }}>Soundscape</H2>
              <Instructions>mouse to move sources / mouse or arrow-keys to move listener</Instructions>
              <PositionControllerContainer />
            </SecondColumn>

            <EmptyColumn />

            <ThirdColumn>
              <ListenerOptionsContainer />
              <ImportExportContainer />
              <ArrowControlsContainer />
          </ThirdColumn>

          </AppContent>

        </div>
      </MuiThemeProvider>
    )
  }
}

export default connect(state => ({
  hasReadDisclaimer: state.alerts.hasReadDisclaimer,
}))(App)
