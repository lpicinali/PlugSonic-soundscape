import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormGroup,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Switch,
} from '@material-ui/core'
import Slider from '@material-ui/lab/Slider'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import { PlaybackTiming, ReachAction } from 'src/constants.js'
import * as CustomPropTypes from 'src/prop-types.js'
import { decibelsToGain, forceDecimals, gainToDecibels } from 'src/utils.js'
import {
  deleteSources,
  setSourceHidden,
  setSourceLoop,
  setSourcePosition,
  setSourceReachAction,
  setSourceReachEnabled,
  setSourceReachFadeDuration,
  setSourceReachRadius,
  setSourceSpatialised,
  setSourceTiming,
  setSourceVolume,
  sourceOnOff,
} from 'src/actions/sources.actions'
import {
  FieldBox,
  FieldGroup,
  H3,
  Label,
  PanelContents,
  SliderBox,
  SwitchBox,
  SwitchControlLabel,
} from 'src/styles/elements.js'

/* ========================================================================== */

const SliderValue = styled.span`
  float: right;
  text-transform: none;
`

function getRelativeDecibelsVolume(gain, minDecibels = -60) {
  return 1 - (gainToDecibels(gain) / minDecibels)
}

/**
 * Source Panel
 *
 * NOTE: The behaviour of X and Y are presented in a way that
 *       follows the X/Y convention that most people are used to.
 */
class SourcePanel extends PureComponent {
  state = {
    isOpen: false,
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
      onSourceHiddenChange,
      onSourceLoopChange,
      onSourceOnOff,
      onSourceReachActionChange,
      onSourceReachEnabledChange,
      onSourceReachFadeDurationChange,
      onSourceReachRadiusChange,
      onSourceSpatialisationChange,
      onSourceTimingChange,
    } = this.props
    const { isOpen, isPromptingDelete } = this.state

    const nestedItems = []

    nestedItems.push(
      <FormGroup row key={`${sourceObject.name}-onofftoggle`}>
        <SwitchControlLabel
          label="ON/OFF"
          labelPlacement="start"
          control={
            <Switch
              color="primary"
              checked={sourceObject.enabled}
              onChange={(evt, isEnabled) => onSourceOnOff(sourceObject.name, isEnabled)}
            />
          }
        />
      </FormGroup>
    )

    nestedItems.push(
      <FieldGroup key={`${sourceObject.name}-volume`}>
        <div>
          <SliderValue>{forceDecimals(getRelativeDecibelsVolume(sourceObject.volume, -60), 2)}</SliderValue>
          <H3>Volume</H3>
        </div>
        <SliderBox>
          <Slider
            min={-60}
            max={0}
            value={gainToDecibels(sourceObject.volume)}
            onChange={(event, value) => this.handleSourceVolume(decibelsToGain(value))}
          />
        </SliderBox>
      </FieldGroup>
    )

    nestedItems.push(
      <FieldGroup key={`${sourceObject.name}-position`}>
        <H3>Position</H3>

        <div>
          <Label>X</Label>
          <SliderValue>
            {parseFloat(
              Math.round(-sourceObject.position.y * 100) / 100
            ).toFixed(2)}{' '}
            m
          </SliderValue>
        </div>
        <SliderBox>
          <Slider
            min={-roomSize.width / 2}
            max={roomSize.width / 2}
            step={0.01}
            value={-sourceObject.position.y}
            onChange={(event, value) => this.handleSourceMove('y', -value)}
          />
        </SliderBox>

        <div>
          <Label>Y</Label>
          <SliderValue>
            {parseFloat(
              Math.round(sourceObject.position.x * 100) / 100
            ).toFixed(2)}{' '}
            m
          </SliderValue>
        </div>
        <SliderBox>
          <Slider
            min={-roomSize.depth / 2}
            max={roomSize.depth / 2}
            step={0.01}
            value={sourceObject.position.x}
            onChange={(event, value) => this.handleSourceMove('x', value)}
          />
        </SliderBox>

        <div>
          <Label>Z</Label>
          <SliderValue>
            {parseFloat(
              Math.round(sourceObject.position.z * 100) / 100
            ).toFixed(2)}{' '}
            m
          </SliderValue>
        </div>
        <SliderBox>
          <Slider
            min={0}
            max={roomSize.height / 2}
            step={0.01}
            value={sourceObject.position.z}
            onChange={(event, value) => this.handleSourceMove('z', value)}
          />
        </SliderBox>
      </FieldGroup>
    )

    nestedItems.push(
      <FieldGroup key="loop">
        <SwitchBox>
          <H3>Loop</H3>
          <Switch
            color="primary"
            checked={sourceObject.loop}
            onChange={(event, isEnabled) =>
              onSourceLoopChange(sourceObject.name, isEnabled)
            }
          />
        </SwitchBox>
      </FieldGroup>
    )

    nestedItems.push(
      <FieldGroup key="spatialisation">
        <SwitchBox>
          <H3>Spatialisation</H3>
          <Switch
            color="primary"
            checked={sourceObject.spatialised}
            onChange={(event, isEnabled) =>
              onSourceSpatialisationChange(sourceObject.name, isEnabled)
            }
          />
        </SwitchBox>
      </FieldGroup>
    )

    nestedItems.push(
      <FieldGroup key="reach">
        <SwitchBox>
          <H3>Reach</H3>
          <Switch
            color="primary"
            checked={sourceObject.reach.isEnabled}
            onChange={(event, isEnabled) =>
              onSourceReachEnabledChange(sourceObject.name, isEnabled)
            }
          />
        </SwitchBox>

        <FieldBox>
          <div>
            <Label>Radius</Label>
            <SliderValue>
              {forceDecimals(sourceObject.reach.radius, 2)} m
            </SliderValue>
          </div>
          <SliderBox>
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
          </SliderBox>
        </FieldBox>

        <FieldBox>
          <Label>Reach behaviour</Label>
          <Select
            style={{ width: '100%' }}
            value={sourceObject.reach.action}
            onChange={evt =>
              onSourceReachActionChange(sourceObject.name, evt.target.value)
            }
          >
            <MenuItem value={ReachAction.TOGGLE_VOLUME}>
              Fade in and out
            </MenuItem>
            <MenuItem value={ReachAction.TOGGLE_PLAYBACK}>
              Start when entering
            </MenuItem>
          </Select>
        </FieldBox>

        <FieldBox>
          <div>
            <Label>Fade duration</Label>
            <SliderValue>
              {forceDecimals(sourceObject.reach.fadeDuration / 1000, 2)} s
            </SliderValue>
          </div>
          <SliderBox>
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
          </SliderBox>
        </FieldBox>
      </FieldGroup>
    )

    nestedItems.push(
      <FieldGroup key="timings">
        <H3>Timings</H3>

        <p>Play this source after:</p>

        <Select
          style={{ width: '100%' }}
          displayEmpty
          value={sourceObject.timings[PlaybackTiming.PLAY_AFTER] || ''}
          onChange={(evt) =>
            onSourceTimingChange(
              sourceObject.name,
              PlaybackTiming.PLAY_AFTER,
              evt.target.value === '' ? null : evt.target.value
            )
          }
        >
          <MenuItem value=""><em>None</em></MenuItem>

          {sources
            .filter(source => source.name !== sourceObject.name)
            .map(source => (
              <MenuItem
                key={source.name}
                value={source.name}
              >
                {source.name}
              </MenuItem>
            ))}
        </Select>
      </FieldGroup>
    )

    nestedItems.push(
      <FieldGroup key="hidden">
        <SwitchBox>
          <H3>Hidden</H3>
          <Switch
            color="primary"
            checked={sourceObject.hidden}
            onChange={(event, isEnabled) =>
              onSourceHiddenChange(sourceObject.name, isEnabled)
            }
          />
        </SwitchBox>
      </FieldGroup>
    )

    nestedItems.push(
      <FieldGroup key={`${sourceObject.name}-delete`}>
        <Button
          variant="contained"
          color="primary"
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
      </FieldGroup>
    )

    return (
      <Fragment>
        <ListItem button onClick={() => this.setState({ isOpen: !isOpen })}>
          <ListItemText primary={sourceObject.name} />
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={isOpen}>
          <PanelContents>
            {nestedItems}
          </PanelContents>
        </Collapse>
      </Fragment>
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
  onSourceDelete: PropTypes.func.isRequired,
  onSourceHiddenChange: PropTypes.func.isRequired,
  onSourceLoopChange: PropTypes.func.isRequired,
  onSourceOnOff: PropTypes.func.isRequired,
  onSourcePositionChange: PropTypes.func.isRequired,
  onSourceReachActionChange: PropTypes.func.isRequired,
  onSourceReachEnabledChange: PropTypes.func.isRequired,
  onSourceReachFadeDurationChange: PropTypes.func.isRequired,
  onSourceReachRadiusChange: PropTypes.func.isRequired,
  onSourceSpatialisationChange: PropTypes.func.isRequired,
  onSourceTimingChange: PropTypes.func.isRequired,
  onSourceVolumeChange: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  roomSize: state.room.size,
  sources: Object.values(state.sources.sources),
})

const mapDispatchToProps = dispatch => ({
  onSourceOnOff: (name, enabled) => dispatch(sourceOnOff(name, enabled)),
  onSourceDelete: name => dispatch(deleteSources([name])),
  onSourceHiddenChange: (name, hidden) => dispatch(setSourceHidden(name, hidden)),
  onSourceLoopChange: (name, loop) => dispatch(setSourceLoop(name, loop)),
  onSourcePositionChange: (name, position) =>
    dispatch(setSourcePosition(name, position)),
  onSourceReachActionChange: (name, action) =>
    dispatch(setSourceReachAction(name, action)),
  onSourceReachEnabledChange: (name, isEnabled) =>
    dispatch(setSourceReachEnabled(name, isEnabled)),
  onSourceReachFadeDurationChange: (name, fadeDuration) =>
    dispatch(setSourceReachFadeDuration(name, fadeDuration)),
  onSourceReachRadiusChange: (name, radius) =>
    dispatch(setSourceReachRadius(name, radius)),
  onSourceSpatialisationChange: (name, spatialised) =>
    dispatch(setSourceSpatialised(name, spatialised)),
  onSourceTimingChange: (name, timing, target) =>
    dispatch(setSourceTiming(name, timing, target)),
  onSourceVolumeChange: (name, volume) =>
    dispatch(setSourceVolume(name, volume)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SourcePanel)
