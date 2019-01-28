/* eslint no-unused-expressions: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint no-unused-vars: 0 */
/* eslint react/forbid-prop-types: 0 */
/* global location */
/* eslint no-restricted-globals: 0 */
/* eslint react/prefer-stateless-function: 0 */
import React, { PureComponent, Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ContainerDimensions from 'react-container-dimensions'

import Soundscape from 'src/containers/Soundscape.js'
import { AppContainer } from 'src/containers/App.style.js'


class App extends Component {
  render() {
    return (
          <AppContainer>
            <ContainerDimensions>
                <Soundscape/>
            </ContainerDimensions>
          </AppContainer>
        )
  }
}

export default App
