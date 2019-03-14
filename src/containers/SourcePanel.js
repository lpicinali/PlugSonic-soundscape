import React, { PureComponent } from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'
import * as colors from 'src/styles/colors'

import { List, ListItem } from "material-ui/List"
import Divider from "material-ui/Divider"
import Slider from 'material-ui/Slider'
import Toggle from 'material-ui/Toggle'

import * as CustomPropTypes from 'src/prop-types.js'
import { setSourcePosition, setSourceVolume, sourceOnOff } from 'src/actions/sources.actions'
import { H3 } from 'src/styles/elements.js'
/* ========================================================================== */
const toggleStyle = {
  margin: `auto`,
  marginTop: `20px`,
  width: `85%`,
}

const toggleLabelStyle = {
  fontSize: `14px`,
  textTransform: `uppercase`,
  letterSpacing: `1px`,
}
/* ========================================================================== */
/* SOURCES TAB */
/* ========================================================================== */
class SourcePanel extends PureComponent {

  handleSourceOnOff = (name) => {
    this.props.onSourceOnOff(this.props.sourceObject.name)
  }

  handleSourceVolume = volume => {
    this.props.onSourceVolumeChange(this.props.sourceObject.name, volume)
  }

  handleSourceMove = (axis, value) => {
    const { sourceObject, onSourcePositionChange } = this.props

    const newPosition = {
      ...sourceObject.position,
      [axis]: value,
    }

    onSourcePositionChange(sourceObject.name, newPosition)
  }

  render() {
    const { roomSize, sourceObject } = this.props

    const nestedItems = []

    nestedItems.push(
      <ListItem
        key={`${sourceObject.name}-onofftoggle`}
        primaryText="ON/OFF"
        rightToggle={
          <Toggle
            onToggle={() => this.props.onSourceOnOff(sourceObject.name)}
            toggled={sourceObject.selected}
          />
        }
      />
    )

    nestedItems.push(
      <ListItem
        key={`${sourceObject.name}-volume`}
      >
        <H3>Volume</H3>
        <Slider
          min={0}
          max={1}
          value={sourceObject.volume}
          onChange={(event, value) => this.handleSourceVolume(value)}
        />
      </ListItem>
    )

    nestedItems.push(
      <ListItem
        key={`${sourceObject.name}-position`}
      >
        <H3>Position</H3>

        <label>X</label>
        <Slider
          min={-roomSize.depth / 2}
          max={roomSize.depth / 2}
          value={sourceObject.position.x}
          onChange={(event, value) => this.handleSourceMove('x', value)}
        />

        <label>Y</label>
        <Slider
          min={-roomSize.width / 2}
          max={roomSize.width / 2}
          value={-sourceObject.position.y}
          onChange={(event, value) => this.handleSourceMove('y', -value)}
        />

        <label>Z</label>
        <Slider
          min={0}
          max={roomSize.height / 2}
          value={sourceObject.position.z}
          onChange={(event, value) => this.handleSourceMove('z', value)}
        />
      </ListItem>
    )

    return (
      <ListItem
        key={sourceObject.name}
        primaryText={sourceObject.name}
        primaryTogglesNestedList
        nestedItems={nestedItems}
      />
    )
  }
}

SourcePanel.propTypes = {
  roomSize: PropTypes.shape({
    width: PropTypes.number.isRequired,
    depth: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  sourceObject: CustomPropTypes.source.isRequired,
  onSourceOnOff: PropTypes.func.isRequired,
  onSourceVolumeChange: PropTypes.func.isRequired,
  onSourcePositionChange: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  roomSize: state.room.size,
})

const mapDispatchToProps = dispatch => ({
  onSourceOnOff: name => dispatch(sourceOnOff(name)),
  onSourceVolumeChange: (name, volume) => dispatch(setSourceVolume(name, volume)),
  onSourcePositionChange: (name, position) => dispatch(setSourcePosition(name, position)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SourcePanel)
