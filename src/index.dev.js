/* global document */
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

// import App from 'src/containers/App.js'
import ContextualApp from 'src/containers/ContextualApp.js'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.querySelector('#app-root')
  )
}

render(ContextualApp)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/ContextualApp.js', () => {
    render(ContextualApp)
  })
}
