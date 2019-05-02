import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import store from 'src/store.js'
import App from 'src/containers/App.js'
import { GlobalStyle } from 'src/containers/ContextualApp.style'
import * as colors from 'src/styles/colors'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.BLACK,
    },
    secondary: {
      main: colors.WHITE,
    },
    error: {
      main: colors.RED,
    },
    // accent2Color: colors.LIGHTGREY,
    // textColor: colors.BLACK,
    // alternateTextColor: colors.WHITE,
  },
  typography: {
    useNextVariants: true,
  },
})

// ===================== CONTEXTUAL APP =========================//
class ContextualApp extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <React.Fragment>
            <GlobalStyle />
            <App />
          </React.Fragment>
        </MuiThemeProvider>
      </Provider>
    )
  }
}

export default ContextualApp
