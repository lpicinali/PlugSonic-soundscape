import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import store from 'src/store.js'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from "material-ui/styles/getMuiTheme"

import App from 'src/containers/App.js'
import { GlobalStyle } from 'src/containers/ContextualApp.style'
import * as colors from 'src/styles/colors'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "#AA412B",
    accent1Color: colors.WHITE,
    accent2Color: colors.TURQOISE,
    alternateTextColor: "#AA412B",
    textColor: "#000",
  },
})

// ===================== CONTEXTUAL APP =========================//
class ContextualApp extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <React.Fragment>
            <GlobalStyle/>
            <App/>
          </React.Fragment>
        </MuiThemeProvider>
      </Provider>
    )
  }
}

export default ContextualApp
