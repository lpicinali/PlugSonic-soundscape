import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
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
import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import DropDownMenu from 'material-ui/DropDownMenu'
import FlatButton from 'material-ui/FlatButton'
import MenuItem from 'material-ui/MenuItem'
import Slider from 'material-ui/Slider'
import Toggle from 'material-ui/Toggle'

import { PlaybackTiming, ReachAction } from 'src/constants.js'
import * as CustomPropTypes from 'src/prop-types.js'
import {
  deleteSources,
  setSourceLoop,
  setSourcePosition,
  setSourceReachEnabled,
  setSourceReachAction,
  setSourceReachRadius,
  setSourceReachFadeDuration,
  setSourceTiming,
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
    const {
      roomSize,
      sources,
      sourceObject,
      onSourceOnOff,
      onSourceLoopChange,
      onSourceReachEnabledChange,
      onSourceReachActionChange,
      onSourceReachRadiusChange,
      onSourceReachFadeDurationChange,
      onSourceTimingChange,
    } = this.props
    const { isPromptingDelete } = this.state

    const nestedItems = []

    nestedItems.push(
      <ListItem
        key={`${sourceObject.name}-onofftoggle`}
        primaryText="ON/OFF"
        rightToggle={
          <Toggle
            toggled={sourceObject.selected}
            onToggle={(event, isEnabled) =>
              onSourceOnOff(sourceObject.name, isEnabled)
            }
          />
        }
      />
    )

    nestedItems.push(
      <ListItem key={`${sourceObject.name}-volume`}>
        <div>
          <SliderValue>{sourceObject.volume}</SliderValue>
          <H3>Volume</H3>
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
      <ListItem key={`${sourceObject.name}-position`}>
        <H3>Position</H3>

        <div>
          <label>X</label>
          <SliderValue>
            {parseFloat(
              Math.round(-sourceObject.position.y * 100) / 100
            ).toFixed(2)}{' '}
            m
          </SliderValue>
        </div>
        <Slider
          min={-roomSize.width / 2}
          max={roomSize.width / 2}
          step={0.01}
          value={-sourceObject.position.y}
          onChange={(event, value) => this.handleSourceMove('y', -value)}
        />

        <div>
          <label>Y</label>
          <SliderValue>
            {parseFloat(
              Math.round(sourceObject.position.x * 100) / 100
            ).toFixed(2)}{' '}
            m
          </SliderValue>
        </div>
        <Slider
          min={-roomSize.depth / 2}
          max={roomSize.depth / 2}
          step={0.01}
          value={sourceObject.position.x}
          onChange={(event, value) => this.handleSourceMove('x', value)}
        />

        <div>
          <label>Z</label>
          <SliderValue>
            {parseFloat(
              Math.round(sourceObject.position.z * 100) / 100
            ).toFixed(2)}{' '}
            m
          </SliderValue>
        </div>
        <Slider
          min={0}
          max={roomSize.height / 2}
          step={0.01}
          value={sourceObject.position.z}
          onChange={(event, value) => this.handleSourceMove('z', value)}
        />
      </ListItem>
    )

    nestedItems.push(
      <ListItem key="loop">
        <H3>Loop</H3>

        <Toggle
          toggled={sourceObject.loop}
          onToggle={(event, isEnabled) =>
            onSourceLoopChange(sourceObject.name, isEnabled)
          }
        />
      </ListItem>
    )

    nestedItems.push(
      <ListItem key="reach">
        <H3>Reach</H3>

        <Toggle
          toggled={sourceObject.reach.isEnabled}
          onToggle={(event, isEnabled) =>
            onSourceReachEnabledChange(sourceObject.name, isEnabled)
          }
        />

        <div>
          <label>Radius</label>
          <SliderValue>{sourceObject.reach.radius} m</SliderValue>
        </div>
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

        <label>Reach behaviour</label>
        <DropDownMenu
          style={{ width: '100%' }}
          iconStyle={{ fill: colors.BLACK }}
          underlineStyle={{ borderTop: `solid 1px ${colors.BLACK}` }}
          value={sourceObject.reach.action}
          onChange={(event, index, value) =>
            onSourceReachActionChange(sourceObject.name, value)
          }
        >
          <MenuItem
            value={ReachAction.TOGGLE_VOLUME}
            primaryText="Fade in and out"
          />
          <MenuItem
            value={ReachAction.TOGGLE_PLAYBACK}
            primaryText="Start when entering"
          />
        </DropDownMenu>

        <div>
          <label>Fade duration</label>
          <SliderValue>{sourceObject.reach.fadeDuration / 1000} s</SliderValue>
        </div>
        <Slider
          min={0}
          max={20}
          step={0.1}
          value={sourceObject.reach.fadeDuration / 1000}
          disabled={sourceObject.reach.isEnabled === false}
          onChange={(event, value) =>
            onSourceReachFadeDurationChange(sourceObject.name, value * 1000)
          }
        />
      </ListItem>
    )

    nestedItems.push(
      <ListItem key="timings">
        <H3>Timings</H3>

        <p>Play this source after:</p>

        <DropDownMenu
          style={{ width: '100%' }}
          iconStyle={{ fill: colors.BLACK }}
          underlineStyle={{ borderTop: `solid 1px ${colors.BLACK}` }}
          value={sourceObject.timings[PlaybackTiming.PLAY_AFTER]}
          onChange={(event, index, value) =>
            onSourceTimingChange(
              sourceObject.name,
              PlaybackTiming.PLAY_AFTER,
              value
            )
          }
        >
          {sources
            .filter(source => source.name !== sourceObject.name)
            .map(source => (
              <MenuItem
                key={source.name}
                value={source.name}
                primaryText={source.name}
                disabled={source.loop === true}
              />
            ))}
        </DropDownMenu>
      </ListItem>
    )

    nestedItems.push(
      <ListItem key={`${sourceObject.name}-delete`}>
        <Button
          variant="contained"
          color="secondary"
          onClick={this.handleSourceDelete}
        >
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
  sources: PropTypes.arrayOf(CustomPropTypes.source).isRequired,
  sourceObject: CustomPropTypes.source.isRequired,
  onSourceOnOff: PropTypes.func.isRequired,
  onSourceVolumeChange: PropTypes.func.isRequired,
  onSourceLoopChange: PropTypes.func.isRequired,
  onSourcePositionChange: PropTypes.func.isRequired,
  onSourceReachEnabledChange: PropTypes.func.isRequired,
  onSourceReachActionChange: PropTypes.func.isRequired,
  onSourceReachRadiusChange: PropTypes.func.isRequired,
  onSourceReachFadeDurationChange: PropTypes.func.isRequired,
  onSourceTimingChange: PropTypes.func.isRequired,
  onSourceDelete: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  roomSize: state.room.size,
  sources: Object.values(state.sources.sources),
})

const mapDispatchToProps = dispatch => ({
  onSourceOnOff: (name, selected) => dispatch(sourceOnOff(name, selected)),
  onSourceVolumeChange: (name, volume) =>
    dispatch(setSourceVolume(name, volume)),
  onSourceLoopChange: (name, loop) => dispatch(setSourceLoop(name, loop)),
  onSourcePositionChange: (name, position) =>
    dispatch(setSourcePosition(name, position)),
  onSourceReachEnabledChange: (name, isEnabled) =>
    dispatch(setSourceReachEnabled(name, isEnabled)),
  onSourceReachActionChange: (name, action) =>
    dispatch(setSourceReachAction(name, action)),
  onSourceReachRadiusChange: (name, radius) =>
    dispatch(setSourceReachRadius(name, radius)),
  onSourceReachFadeDurationChange: (name, fadeDuration) =>
    dispatch(setSourceReachFadeDuration(name, fadeDuration)),
  onSourceTimingChange: (name, timing, target) =>
    dispatch(setSourceTiming(name, timing, target)),
  onSourceDelete: name => dispatch(deleteSources([name])),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SourcePanel)
