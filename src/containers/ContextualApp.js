/* eslint react/prefer-stateless-function: 0 */
import React, { PureComponent } from 'react'
// import { Provider } from 'react-redux'

// import store from 'src/store.js'
import App from 'src/containers/App.js'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { GlobalStyle } from 'src/containers/ContextualApp.style'


// ===================== CONTEXTUAL APP =========================//
class ContextualApp extends PureComponent {
  render() {
    return (
      // <Provider store={store}>

        <MuiThemeProvider>
          <React.Fragment>
            <GlobalStyle/>
            <App/>
          </React.Fragment>
        </MuiThemeProvider>
      // </Provider>
    )
  }
}

export default ContextualApp
