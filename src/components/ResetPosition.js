import React, { Component} from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import * as colors from 'src/styles/colors'

import {H2} from 'src/styles/elements'
import FlatButton from "material-ui/FlatButton"

import { setListenerPosition } from 'src/actions/listener.actions'
/* ========================================================================== */
const FlatButtonStyle = {
  width: '85%',
  margin: `auto`,
  textColor: `${colors.WHITE}`,
}
/* ========================================================================== */
/* RESET POSITION */
/* ========================================================================== */
class ResetPosition extends Component {

  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <div style={{display: `flex`, flexDirection: `column`, justifyContent:`center`}}>
        <H2>RESET POSITION</H2>
        <FlatButton style={FlatButtonStyle} backgroundColor={`${colors.BLACK}`} onClick={() => this.props.onListenerMove({x:0,y:0,z:0,rotZAxis:0})} secondary>
          LISTENER
        </FlatButton>
      </div>
    )
  }
}

ResetPosition.propTypes = {
  onListenerMove: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  onListenerMove: position => dispatch(setListenerPosition(position)),
})

export default connect(null,mapDispatchToProps)(ResetPosition)
