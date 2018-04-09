/* eslint react/prefer-stateless-function: 0 */
/* eslint react/forbid-prop-types: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
// import FileSaver from 'file-saver';

import Button from 'src/components/Button.js'

import { H2, H3 } from 'src/styles/elements.js'

/**
 * Import/Export Container
 */
class ImportExportContainer extends Component {
  static propTypes = {
    targets: PropTypes.object.isRequired,
    room: PropTypes.object.isRequired,
  }

  @autobind
  handleExportSoundscape() {
    const soundscape = {
      targets: this.props.targets,
      room: this.props.room,
    }

    console.log(`soundscape:`)
    console.log(soundscape)
  }

  render() {
    return (
      <div>
        <H2>Import/Export</H2>

        <H3>Soundscape</H3>
        <Button
          key="exportscape"
          onClick={this.handleExportSoundscape}
          style={{ float: `left` }}
        >
          Export
        </Button>

        <H3>Soundscape + Assets</H3>
      </div>
    )
  }
}

export default connect(
  state => ({
    targets: state.target.targets,
    room: state.room,
  })
  // dispatch => ({
  //   // onSelect: target => dispatch(setTarget(target)),
  //   // onChangeVolume: volume => dispatch(setTargetVolume(volume)),
  // })
)(ImportExportContainer)
