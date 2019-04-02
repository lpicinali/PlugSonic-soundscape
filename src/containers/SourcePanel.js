import React, { PureComponent } from "react"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'
import { List, ListItem } from "material-ui/List"
import Divider from "material-ui/Divider"
import FlatButton from "material-ui/FlatButton"
import Slider from 'material-ui/Slider'
import Toggle from 'material-ui/Toggle'

import * as CustomPropTypes from 'src/prop-types.js'
import {
  deleteSources,
  setSourcePosition,
  setSourceReachEnabled,
  setSourceReachRadius,
  setSourceVolume,
  sourceOnOff,
} from 'src/actions/sources.actions'
import * as colors from 'src/styles/colors.js'
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

const SliderValue = styled.span`
  float: right;
  text-transform: none;
`

/**
 * Source Panel
 *
 * NOTE: The behaviour of X and Y are presented in a way that
 *       follows the X/Y convention that most people are used to.
 */
class SourcePanel extends PureComponent {
  state = {
    isPromptingDelete: false,
  }

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

  handleSourceDelete = () => {
    this.setState({
      isPromptingDelete: true,
    })
  }

  handleSourceDeletionResponse = shouldDelete => {
    if (shouldDelete === true) {
      this.props.onSourceDelete(this.props.sourceObject.name)
    }

    this.setState({
      isPromptingDelete: false,
    })
  }

  render() {
    const { roomSize, sourceObject, onSourceReachEnabledChange, onSourceReachRadiusChange } = this.props
    const { isPromptingDelete } = this.state

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
        <div>
          <H3>Volume</H3>
          <SliderValue>{sourceObject.volume}</SliderValue>
        </div>
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

        <div>
          <label>X</label>
          <SliderValue>{-sourceObject.position.y} m</SliderValue>
        </div>
        <Slider
          min={-roomSize.width / 2}
          max={roomSize.width / 2}
          step={0.1}
          value={-sourceObject.position.y}
          onChange={(event, value) => this.handleSourceMove('y', -value)}
        />

        <div>
          <label>Y</label>
          <SliderValue>{sourceObject.position.x} m</SliderValue>
        </div>
        <Slider
          min={-roomSize.depth / 2}
          max={roomSize.depth / 2}
          step={0.1}
          value={sourceObject.position.x}
          onChange={(event, value) => this.handleSourceMove('x', value)}
        />

        <div>
          <label>Z</label>
          <SliderValue>{sourceObject.position.z} m</SliderValue>
        </div>
        <Slider
          min={0}
          max={roomSize.height / 2}
          step={0.1}
          value={sourceObject.position.z}
          onChange={(event, value) => this.handleSourceMove('z', value)}
        />
      </ListItem>
    )

    nestedItems.push(
      <ListItem key="reach">
        <H3>Reach</H3>

        <Toggle
          toggled={sourceObject.reach.isEnabled}
          onToggle={(event, isEnabled) => onSourceReachEnabledChange(sourceObject.name, isEnabled)}
        />

        <Slider
          min={0}
          max={Math.max(roomSize.width, roomSize.height) / 2}
          step={0.1}
          value={sourceObject.reach.radius}
          disabled={sourceObject.reach.isEnabled === false}
          onChange={(event, value) =>
            onSourceReachRadiusChange(sourceObject.name, value)
          }
        />
      </ListItem>
    )

    nestedItems.push(
      <ListItem key={`${sourceObject.name}-delete`}>
        <Button variant="contained" color="secondary" onClick={this.handleSourceDelete}>
          Delete
        </Button>

        <Dialog
          open={isPromptingDelete}
          onClose={() => this.handleSourceDeletionResponse(false)}
        >
          <DialogTitle>Just to make sure</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this source?
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              color="secondary"
              onClick={() => this.handleSourceDeletionResponse(false)}
            >
              No
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => this.handleSourceDeletionResponse(true)}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
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
  onSourceReachEnabledChange: PropTypes.func.isRequired,
  onSourceReachRadiusChange: PropTypes.func.isRequired,
  onSourceDelete: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  roomSize: state.room.size,
})

const mapDispatchToProps = dispatch => ({
  onSourceOnOff: name => dispatch(sourceOnOff(name)),
  onSourceVolumeChange: (name, volume) => dispatch(setSourceVolume(name, volume)),
  onSourcePositionChange: (name, position) => dispatch(setSourcePosition(name, position)),
  onSourceReachEnabledChange: (name, isEnabled) => dispatch(setSourceReachEnabled(name, isEnabled)),
  onSourceReachRadiusChange: (name, radius) => dispatch(setSourceReachRadius(name, radius)),
  onSourceDelete: name => dispatch(deleteSources([name])),
})

export default connect(mapStateToProps, mapDispatchToProps)(SourcePanel)
