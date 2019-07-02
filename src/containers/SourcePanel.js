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
  Divider,
  FormGroup,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Switch,
  withStyles,
} from '@material-ui/core'
import Slider from '@material-ui/lab/Slider'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import {
  PlaybackTiming,
  ReachAction,
  SourcePositioning,
} from 'src/constants.js'
import * as CustomPropTypes from 'src/prop-types.js'
import {
  decibelsToGain,
  forceDecimals,
  gainToDecibels,
  sourceMayUseTimings,
} from 'src/utils.js'
import {
  deleteSources,
  setSourceHidden,
  setSourceLoop,
  setSourcePositioning,
  setSourcePosition,
  setSourceRelativePosition,
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

const SourceListItem = withStyles({
  root: {
    paddingLeft: 24,
  },
})(ListItem)

const SourceListItemText = withStyles({
  primary: {
    fontSize: 16,
  },
})(ListItemText)

const SourceControlsContent = styled(PanelContents)`
  padding-top: 8px;
  border-top: 1px solid #eee;
`

function getRelativeDecibelsVolume(gain, minDecibels = -60) {
  return 1 - gainToDecibels(gain) / minDecibels
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

  $item = null

  componentDidUpdate = prevProps => {
    const { focusedItem, sourceObject } = this.props

    if (
      prevProps.focusedItem !== focusedItem &&
      focusedItem === sourceObject.name
    ) {
      this.setState({ isOpen: true }, () => {
        if (this.$item.scrollIntoView) {
          setTimeout(() => {
            this.$item.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest',
            })
          }, 100)
        }
      })
    }
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

  handleSourceMoveRelative = (prop, value) => {
    const { sourceObject, onSourceRelativePositionChange } = this.props

    const newPosition = {
      ...sourceObject.relativePosition,
      [prop]: value,
    }

    onSourceRelativePositionChange(sourceObject.name, newPosition)
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
      onSourcePositioningChange,
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
              onChange={(evt, isEnabled) =>
                onSourceOnOff(sourceObject.name, isEnabled)
              }
            />
          }
        />
      </FormGroup>
    )

    nestedItems.push(
      <FieldGroup key={`${sourceObject.name}-volume`}>
        <div>
          <SliderValue>
            {forceDecimals(
              getRelativeDecibelsVolume(sourceObject.volume, -60),
              2
            )}
          </SliderValue>
          <H3>Volume</H3>
        </div>
        <SliderBox>
          <Slider
            min={-60}
            max={0}
            value={gainToDecibels(sourceObject.volume)}
            onChange={(event, value) =>
              this.handleSourceVolume(decibelsToGain(value))
            }
          />
        </SliderBox>
      </FieldGroup>
    )

    nestedItems.push(
      <FieldGroup key={`${sourceObject.name}-position`}>
        <H3>Position</H3>

        <SwitchControlLabel
          label="Relative to listener"
          labelPlacement="start"
          control={
            <Switch
              color="primary"
              checked={sourceObject.positioning === SourcePositioning.RELATIVE}
              onChange={(event, isRelative) =>
                onSourcePositioningChange(
                  sourceObject.name,
                  isRelative
                    ? SourcePositioning.RELATIVE
                    : SourcePositioning.ABSOLUTE
                )
              }
            />
          }
        />

        {sourceObject.positioning === SourcePositioning.ABSOLUTE && (
          <Fragment>
            <div>
              <Label>X</Label>
              <SliderValue>
                {forceDecimals(-sourceObject.position.y, 2)} m
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
                {forceDecimals(sourceObject.position.x, 2)} m
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
                {forceDecimals(sourceObject.position.z, 2)} m
              </SliderValue>
            </div>
            <SliderBox>
              <Slider
                min={0}
                max={roomSize.height}
                step={0.01}
                value={sourceObject.position.z}
                onChange={(event, value) => this.handleSourceMove('z', value)}
              />
            </SliderBox>
          </Fragment>
        )}

        {sourceObject.positioning === SourcePositioning.RELATIVE && (
          <Fragment>
            <div>
              <Label>Angle</Label>
              <SliderValue>
                {Math.round(
                  (sourceObject.relativePosition.azimuth * 180) / Math.PI
                )}{' '}
                degrees
              </SliderValue>
            </div>
            <SliderBox>
              <Slider
                min={-Math.PI}
                max={Math.PI}
                step={(Math.PI * 2) / 360}
                value={sourceObject.relativePosition.azimuth}
                onChange={(event, value) =>
                  this.handleSourceMoveRelative('azimuth', value)
                }
              />
            </SliderBox>

            <div>
              <Label>Distance</Label>
              <SliderValue>
                {forceDecimals(sourceObject.relativePosition.distance, 2)} m
              </SliderValue>
            </div>
            <SliderBox>
              <Slider
                min={0.3}
                max={Math.max(roomSize.width, roomSize.depth)}
                step={0.01}
                value={sourceObject.relativePosition.distance}
                onChange={(event, value) =>
                  this.handleSourceMoveRelative('distance', value)
                }
              />
            </SliderBox>
          </Fragment>
        )}
      </FieldGroup>
    )

    nestedItems.push(
      <div key="loop">
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
      </div>
    )

    nestedItems.push(
      <FieldGroup
        key="spatialisation"
        style={{ marginBottom: 0 }}
        disabled={sourceObject.positioning === SourcePositioning.RELATIVE}
      >
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
      <FieldGroup
        key="reach"
        disabled={sourceObject.positioning === SourcePositioning.RELATIVE}
      >
        <SwitchBox>
          <H3>Reach</H3>
          <Switch
            color="primary"
            checked={sourceObject.reach.enabled}
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
              disabled={sourceObject.reach.enabled === false}
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
            disabled={sourceObject.reach.enabled === false}
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
              disabled={sourceObject.reach.enabled === false}
              onChange={(event, value) =>
                onSourceReachFadeDurationChange(sourceObject.name, value * 1000)
              }
            />
          </SliderBox>
        </FieldBox>
      </FieldGroup>
    )

    nestedItems.push(
      <FieldGroup
        key="timings"
        disabled={sourceMayUseTimings(sourceObject) === false}
      >
        <H3>Timings</H3>

        <p>Play this source only after the start of:</p>

        <Select
          style={{ width: '100%' }}
          displayEmpty
          value={sourceObject.timings[PlaybackTiming.PLAY_AFTER] || ''}
          onChange={evt =>
            onSourceTimingChange(
              sourceObject.name,
              PlaybackTiming.PLAY_AFTER,
              evt.target.value === '' ? null : evt.target.value
            )
          }
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>

          {sources
            .filter(source => source.name !== sourceObject.name)
            .map(source => (
              <MenuItem
                key={source.name}
                value={source.name}
                disabled={sourceMayUseTimings(source) === false}
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
            <Button onClick={() => this.handleSourceDeletionResponse(false)}>
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
        <div ref={$el => (this.$item = $el)} />

        <SourceListItem
          button
          onClick={() => this.setState({ isOpen: !isOpen })}
        >
          <SourceListItemText primary={sourceObject.name} />
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </SourceListItem>

        <Collapse in={isOpen}>
          <SourceControlsContent>{nestedItems}</SourceControlsContent>
        </Collapse>

        <Divider />
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
  focusedItem: PropTypes.string,
  onSourceDelete: PropTypes.func.isRequired,
  onSourceHiddenChange: PropTypes.func.isRequired,
  onSourceLoopChange: PropTypes.func.isRequired,
  onSourceOnOff: PropTypes.func.isRequired,
  onSourcePositioningChange: PropTypes.func.isRequired,
  onSourcePositionChange: PropTypes.func.isRequired,
  onSourceRelativePositionChange: PropTypes.func.isRequired,
  onSourceReachActionChange: PropTypes.func.isRequired,
  onSourceReachEnabledChange: PropTypes.func.isRequired,
  onSourceReachFadeDurationChange: PropTypes.func.isRequired,
  onSourceReachRadiusChange: PropTypes.func.isRequired,
  onSourceSpatialisationChange: PropTypes.func.isRequired,
  onSourceTimingChange: PropTypes.func.isRequired,
  onSourceVolumeChange: PropTypes.func.isRequired,
}

SourcePanel.defaultProps = {
  focusedItem: null,
}

const mapStateToProps = state => ({
  roomSize: state.room.size,
  sources: Object.values(state.sources.sources),
  focusedItem: state.sources.focusedItem,
})

const mapDispatchToProps = dispatch => ({
  onSourceOnOff: (name, enabled) => dispatch(sourceOnOff(name, enabled)),
  onSourceDelete: name => dispatch(deleteSources([name])),
  onSourceHiddenChange: (name, hidden) =>
    dispatch(setSourceHidden(name, hidden)),
  onSourceLoopChange: (name, loop) => dispatch(setSourceLoop(name, loop)),
  onSourcePositioningChange: (name, positioning) =>
    dispatch(setSourcePositioning(name, positioning)),
  onSourcePositionChange: (name, position) =>
    dispatch(setSourcePosition(name, position)),
  onSourceRelativePositionChange: (name, position) =>
    dispatch(setSourceRelativePosition(name, position)),
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
