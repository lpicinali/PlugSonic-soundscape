/* global window */
/* eslint react/prefer-stateless-function: 0 */
/* eslint no-unused-vars: 0 */
/* eslint react/forbid-prop-types: 0 */
/* eslint react/no-unused-prop-types: 0 */

/* ------------------- NOTES -------------------- *//*

    from z_PositionControllerContainer_0.0_original

     - propTypes
     - remapped targetPosition
     - changes to manage multple active sources (selected)

*//* ---------------------------------------------- */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as CustomPropTypes from 'src/prop-types.js'
import { setTargetPosition } from 'src/actions/target.actions.js'
import { setListenerPosition } from 'src/actions/listener.actions.js'
import ContainerDimensionsWithScrollUpdates from 'src/components/ContainerDimensionsWithScrollUpdates.js'
import PositionController from 'src/components/PositionController.js'

const BoundsRelay = rect => {}

/**
 * Position Controller Container
 */
class PositionControllerContainer extends Component {
  static propTypes = {
    listenerPosition: PropTypes.object.isRequired,
    headRadius: PropTypes.number.isRequired,
    targets: PropTypes.object.isRequired,
    selected: PropTypes.array.isRequired,
    onTargetMove: PropTypes.func.isRequired,
    onListenerMove: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  render() {
    const {
      listenerPosition,
      headRadius,
      targets,
      selected,
      onTargetMove,
      onListenerMove
    } = this.props

    const objects = selected.map(
      (target) => (
        {
          id: targets[target].filename,
          label: targets[target].title,
          azimuth: targets[target].position.azimuth,
          distance: targets[target].position.distance,
        }
      )
    );

    return (
      <div
        style={{
          position: 'relative',
          width: 200,
          height: 200,
        }}
      >
        <ContainerDimensionsWithScrollUpdates scrollTarget={window}>
          {rect => (
            <PositionController
              bounds={rect}
              objects={objects}
              listenerPosition={listenerPosition}
              headRadius={headRadius}
              onPositionChange={(id, position) => onTargetMove(id, position)}
              onListenerChange={position => onListenerMove(position)}
            />
          )}
        </ContainerDimensionsWithScrollUpdates>
      </div>
    )
  }
}

export default connect(
  state => ({
    listenerPosition: state.listener.position,
    headRadius: state.controls.headRadius,
    targets: state.target.targets,
    selected: state.target.selected,
  }),
  dispatch => ({
    onTargetMove: (id, position) => dispatch(setTargetPosition(id, position)),
    onListenerMove: position => dispatch(setListenerPosition(position))
  })
)(PositionControllerContainer)
