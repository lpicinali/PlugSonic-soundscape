/* global document */
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from 'src/containers/App.js'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.querySelector('#app-root')
  )
}

render(App)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/App.js', () => {
    render(App)
  })
}
