import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { H2 } from 'src/styles/elements'
import { Button } from '@material-ui/core'

import { setListenerPosition } from 'src/actions/listener.actions'

/* ========================================================================== */
/* RESET POSITION */
/* ========================================================================== */
class ResetPositionButton extends Component {
  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <Fragment>
        <H2>RESET POSITION</H2>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() =>
            this.props.onListenerMove({ x: 0, y: 0, z: 0, rotZAxis: 0 })
          }
        >
          LISTENER
        </Button>
      </Fragment>
    )
  }
}

ResetPositionButton.propTypes = {
  onListenerMove: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  onListenerMove: position => dispatch(setListenerPosition(position)),
})

export default connect(
  null,
  mapDispatchToProps
)(ResetPositionButton)
