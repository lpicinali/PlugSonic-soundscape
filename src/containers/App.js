/* eslint no-unused-expressions: 0 */
/* global location */
/* eslint no-restricted-globals: 0 */
import React from 'react'
import { Provider } from 'react-redux'
import styled, { injectGlobal } from 'styled-components'

import store from 'src/store.js'
import PlaybackControlsContainer from 'src/containers/PlaybackControlsContainer.js'
import PositionControllerContainer from 'src/containers/PositionControllerContainer.js'
import TargetSelectorContainer from 'src/containers/TargetSelectorContainer.js'
import ListenerOptionsContainer from 'src/containers/ListenerOptionsContainer.js'
import ImportExportContainer from 'src/containers/ImportExportContainer.js'
import { BLUE } from 'src/styles/colors.js'
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
`
const Logo = styled.img`
  max-height: 80px;
  float: right;
  padding: 16px 32px;
`

const AppContent = styled.div`
  display: flex;
  width: 100%;
  max-width: ${MAX_WIDTH}px;
  margin: 0 auto;
  padding: 24px 16px;
`

export default function App() {
  return (
    <Provider store={store}>
      <div>
        <Header>
          <Logo
            src={`${
              location.origin
            }/assets/img/pluggy_final_logo_RGB_small.png`}
            alt=""
          />
          <HeaderContent>
            <div>PlugSonic Demo</div>
            <Heading>PlugSonic - Create</Heading>
          </HeaderContent>
        </Header>

        <AppContent>
          <PlaybackControlsContainer />

          <div
            style={{ display: 'flex', flexWrap: 'wrap', flex: '0 1 33.333%' }}
          >
            <TargetSelectorContainer />
          </div>

          <div style={{ flex: '0 1 33.333%' }}>
            <H2>Surface</H2>
            <H3>Position</H3>
            <H4>- mouse to move sources</H4>
            <H4>- mouse/arrow-keys to move listener</H4>
            <PositionControllerContainer />
          </div>

          <div style={{ flex: '0 1 33.333%' }}>
            <ListenerOptionsContainer />
            <ImportExportContainer />
          </div>
        </AppContent>
      </div>
    </Provider>
  )
}
