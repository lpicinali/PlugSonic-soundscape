import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { H2 } from 'src/styles/elements'
import { Button } from '@material-ui/core'

import { setListenerPosition } from 'src/actions/listener.actions'
/* ========================================================================== */
const FlatButtonStyle = {
  width: '85%',
  margin: `auto`,
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
/* ========================================================================== */
/* RESET POSITION */
/* ========================================================================== */
class ResetPositionButton extends Component {
  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <Container>
        <H2>RESET POSITION</H2>
        <Button
          variant="contained"
          color="primary"
          style={FlatButtonStyle}
          onClick={() =>
            this.props.onListenerMove({ x: 0, y: 0, z: 0, rotZAxis: 0 })
          }
        >
          LISTENER
        </Button>
      </Container>
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
