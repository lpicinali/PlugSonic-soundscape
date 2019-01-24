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



















// class App extends Component {
//   static propTypes = {
//     hasReadDisclaimer: PropTypes.bool.isRequired,
//   }
//
//   state = {
//     showSettingsDrawer: false,
//     showArrowsDrawer: false
//   }
//
//   handleSettingsDrawer() {
//     this.setState({...this.state, showSettingsDrawer: !this.state.showSettingsDrawer })
//   }
//
//   handleArrowsDrawer() {
//     this.setState({...this.state, showArrowsDrawer: !this.state.showArrowsDrawer })
//   }
//
//   render() {
//     const { hasReadDisclaimer } = this.props
//
//     return (
//       <MuiThemeProviderOld>
//         <React.Fragment>
//           <GlobalStyle />
//           <AppContent>
//
//             {/* <Header> Header </Header> */}
//
//             {/* <ScapeContainer showSettingsDrawer={this.state.showSettingsDrawer}>
//               <ContainerDimensions>
//                 { ({width,height}) => <PositionController width={width} height={height}/> }
//               </ContainerDimensions>
//             </ScapeContainer> */}
//             AppContent
//             <ContainerDimensions>
//               { ({width, height}) => (
//                 <SoundscapeContainer width={width} height={height}>SoundscapeContainer</SoundscapeContainer>
//               )}
//             </ContainerDimensions>
//
//             {/* <MasterVolContainer showSettingsDrawer={this.state.showSettingsDrawer} showArrowsDrawer={this.state.showArrowsDrawer}> Master Vol Container </MasterVolContainer> */}
//
//             {/* <PlaybackContainer showSettingsDrawer={this.state.showSettingsDrawer} showArrowsDrawer={this.state.showArrowsDrawer}> Playback Container </PlaybackContainer> */}
//             {/* <SettingsIconContainer onClick={() => {this.handleSettingsDrawer()}}>
//               Settings Icon
//             </SettingsIconContainer> */}
//
//             {/* <ArrowsContainer
//               onClick={() => {this.handleArrowsDrawer()}}
//               showArrowsDrawer={this.state.showArrowsDrawer}
//               >
//               Arrows Container
//             </ArrowsContainer> */}
//
//             {/* <SettingsDrawer showSettingsDrawer={this.state.showSettingsDrawer}>
//               Settings Drawer
//             </SettingsDrawer> */}
//
//           </AppContent>
//         </React.Fragment>
//
//       </MuiThemeProviderOld>
//     )
//   }
// }
//
// export default connect(state => ({
//   hasReadDisclaimer: state.alerts.hasReadDisclaimer,
// }))(App)
