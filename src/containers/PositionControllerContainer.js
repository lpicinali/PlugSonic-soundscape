/* global window */
/* eslint react/prefer-stateless-function: 0 */
/* eslint react/forbid-prop-types: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint no-lonely-if: 0 */
/* eslint no-unused-vars: 0 */

/* ------------------- NOTES -------------------- */ /*

  TO DO:
  - tune room resizing function

*/ /* ---------------------------------------------- */

import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import PlaybackControlsContainer from 'src/containers/PlaybackControlsContainer.js'

import MenuItem from 'material-ui/MenuItem';
import Slider from 'material-ui/Slider'
import TextField from 'material-ui/TextField';
import { RoomShape } from 'src/constants.js'
import { values, toNumber, isNaN, forEach } from 'lodash'

import { setEditingTarget, setTargetPosition, setTargetReach } from 'src/actions/target.actions.js'
import { setListenerPosition } from 'src/actions/listener.actions.js'
import { setRoomShape, setRoomSize } from 'src/actions/room.actions.js'
import ContainerDimensionsWithScrollUpdates from 'src/components/ContainerDimensionsWithScrollUpdates.js'
import PositionController from 'src/components/PositionController.js'
import Button from 'src/components/Button.js'
import { H3 } from 'src/styles/elements.js'

import {
  ListenerResetButton,
  NoSelectedSourcePlaceholder,
  SourceEditingWrapper,
  SourceReachRadiusField,
  SourceReachFadeDurationField,
  SourceEditingDoneButton,
  Instructions,
  ContainerDiv,
  StyledDropDownMenu,
  ddmIconStyle,
  ddmLabelStyle,
  ddmListStyle,
  ddmMenuItemStyle,
  ddmMenuStyle,
  ddmSelectedMenuItemStyle,
  ddmUnderlineStyle,
  tfFloatingLabelFocusStyle,
  tfFloatingLabelStyle,
  tfInputStyle,
  tfStyle,
  tfUnderlineFocusStyle,
  tfUnderlineStyle,
} from 'src/containers/PositionControllerContainer.style'

const minWidth = 3
const maxWidth = 100
const minHeight = 3
const maxHeight = 100

let gState = {
  shape: RoomShape.RECTANGULAR,
  size: { width: 30, height: 20 },
  errorTextW: '',
  errorTextH: '',
}

/**
 * Position Controller Container
 */
class PositionControllerContainer extends Component {
  static propTypes = {
    listenerPosition: PropTypes.object.isRequired,
    headRadius: PropTypes.number.isRequired,
    targets: PropTypes.object.isRequired,
    selected: PropTypes.array.isRequired,
    editingTarget: PropTypes.string,
    roomShape: PropTypes.oneOf(values(RoomShape)).isRequired,
    roomSize: PropTypes.object.isRequired,
    onSelectTarget: PropTypes.func.isRequired,
    onSetTargetReach: PropTypes.func.isRequired,
    onTargetMove: PropTypes.func.isRequired,
    onListenerMove: PropTypes.func.isRequired,
    onShapeChange: PropTypes.func.isRequired,
    onSizeChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    editingTarget: null,
  }

  state = {
    shape: gState.shape,
    size: { width: gState.size.width, height: gState.size.width },
    errorTextW: '',
    errorTextH: '',
  }

  @autobind
  handleDropDownChange(event, index, value) {
    if (value === 'ROUND') {
      const newSize = {
        width: this.props.roomSize.width,
        height: this.props.roomSize.width,
      }
      gState = { ...gState, size: newSize, shape: RoomShape.ROUND }
      this.setState({ ...this.state, size: newSize, shape: RoomShape.ROUND })
      this.props.onShapeChange(RoomShape.ROUND)
      this.props.onSizeChange(newSize)
    } else if (value === 'RECTANGULAR') {
      gState = { ...gState, shape: RoomShape.RECTANGULAR }
      this.setState({ ...this.state, shape: RoomShape.RECTANGULAR })
      this.props.onShapeChange(RoomShape.RECTANGULAR)
    }
  }

  @autobind
  handleSourcesReset() {
    let index = 0
    forEach(this.props.targets, target => {
      const id = target.filename
      const position = {
        azimuth: index * Math.PI / 6,
        distance:
          Math.min(this.props.roomSize.width, this.props.roomSize.height) / 4,
      }
      this.props.onTargetMove(id, position)
      index += 1
    })
  }

  @autobind
  handleTextFieldChange(event) {
    const val = event.target.value
    // ROUND
    if (this.props.roomShape === RoomShape.ROUND) {
      // Empty string
      if (val.length === 0) {
        const newSize = { width: '', height: '' }
        gState = {
          ...gState,
          size: newSize,
          errorTextW: `Invalid: ${minWidth} < W < ${maxWidth}`,
          errorTextH: '',
        }
        this.setState({
          ...this.state,
          size: newSize,
          errorTextW: `Invalid: ${minWidth} < W < ${maxWidth}`,
          errorTextH: '',
        })
      }
      // Number
      else if (!isNaN(toNumber(val))) {
        if (val >= minWidth && val <= maxWidth) {
          const newSize = { width: toNumber(val), height: toNumber(val) }
          gState = {
            ...gState,
            size: newSize,
            errorTextW: '',
            errorTextH: '',
          }
          this.setState({
            ...this.state,
            size: newSize,
            errorTextW: '',
            errorTextH: '',
          })
          this.props.onSizeChange(newSize)
        } else {
          const newSize = { width: toNumber(val), height: toNumber(val) }
          gState = {
            ...gState,
            size: newSize,
            errorTextW: `Invalid: ${minWidth} < W < ${maxWidth}`,
            errorTextH: '',
          }
          this.setState({
            ...this.state,
            size: newSize,
            errorTextW: `Invalid: ${minWidth} < W < ${maxWidth}`,
            errorTextH: '',
          })
        }
      }
      // Not a Number
      else {
        const newSize = { ...this.state.size, width: val }
        gState = {
          ...gState,
          size: newSize,
          errorTextW: 'Invalid: NaN',
          errorTextH: '',
        }
        this.setState({
          ...this.state,
          size: newSize,
          errorTextW: 'Invalid: NaN',
          errorTextH: '',
        })
      }
    }
    // RECTANGULAR
    else {
      // WIDTH
      if (event.target.id === 'width') {
        // Empty string
        if (val.length === 0) {
          const newSize = { ...this.state.size, width: '' }
          gState = {
            ...gState,
            size: newSize,
            errorTextW: `Invalid: ${minWidth} < W < ${maxWidth}`,
          }
          this.setState({
            ...this.state,
            size: newSize,
            errorTextW: `Invalid: ${minWidth} < W < ${maxWidth}`,
          })
        }
        // Number
        else if (!isNaN(toNumber(val))) {
          if (val >= minWidth && val <= maxWidth) {
            const newSize = { ...this.state.size, width: toNumber(val) }
            gState = {
              ...gState,
              size: newSize,
              errorTextW: '',
            }
            this.setState({
              ...this.state,
              size: newSize,
              errorTextW: '',
            })
            this.props.onSizeChange(newSize)
          } else {
            const newSize = { ...this.state.size, width: toNumber(val) }
            gState = {
              ...gState,
              size: newSize,
              errorTextW: `Invalid: ${minWidth} < W < ${maxWidth}`,
            }
            this.setState({
              ...this.state,
              size: newSize,
              errorTextW: `Invalid: ${minWidth} < W < ${maxWidth}`,
            })
          }
        }
        // Not a Number
        else {
          const newSize = { ...this.state.size, width: val }
          gState = {
            ...gState,
            size: newSize,
            errorTextW: 'Invalid: NaN',
          }
          this.setState({
            ...this.state,
            size: newSize,
            errorTextW: 'Invalid: NaN',
          })
        }
      }
      // HEIGHT
      else {
        // Empty string
        if (val.length === 0) {
          const newSize = { ...this.state.size, height: '' }
          gState = {
            ...gState,
            size: newSize,
            errorTextH: `Invalid: ${minWidth} < W < ${maxWidth}`,
          }
          this.setState({
            ...this.state,
            size: newSize,
            errorTextH: `Invalid: ${minWidth} < W < ${maxWidth}`,
          })
        }
        // Number
        else if (!isNaN(toNumber(val))) {
          if (val >= minHeight && val <= maxHeight) {
            const newSize = { ...this.state.size, height: toNumber(val) }
            gState = {
              ...gState,
              size: newSize,
              errorTextH: '',
            }
            this.setState({
              ...this.state,
              size: newSize,
              errorTextH: '',
            })
            this.props.onSizeChange(newSize)
          } else {
            const newSize = { ...this.state.size, height: toNumber(val) }
            gState = {
              ...gState,
              size: newSize,
              errorTextH: `Invalid: ${minHeight} < H < ${maxHeight}`,
            }
            this.setState({
              ...this.state,
              size: newSize,
              errorTextH: `Invalid: ${minHeight} < H < ${maxHeight}`,
            })
          }
        }
        // Not a Number
        else {
          const newSize = { ...this.state.size, height: val }
          gState = {
            ...gState,
            size: newSize,
            errorTextH: 'Invalid: NaN',
          }
          this.setState({
            ...this.state,
            size: newSize,
            errorTextH: 'Invalid: NaN',
          })
        }
      }
    }
  }

  render() {
    const {
      listenerPosition,
      headRadius,
      targets,
      selected,
      editingTarget,
      roomShape,
      roomSize,
      onSelectTarget,
      onSetTargetReach,
      onTargetMove,
      onListenerMove,
    } = this.props

    const objects = selected.map(
      (target) => (
        {
          id: targets[target].filename,
          label: targets[target].title,
          azimuth: targets[target].position.azimuth,
          distance: targets[target].position.distance,
          reach: targets[target].reach,
        }
      )
    );

    if (gState !== this.state) {
      this.state = gState
    }

    // width: `${(1 - 1.05 ** -roomSize.width) * 360 * 0.95}px`,
    // height: `${(1 - 1.05 ** -roomSize.height) * 360 * 0.95}px`,

    // const width = document.getElementById('container').offsetWidth;
    // console.log('CONTAINER WIDTH')
    // console.log(width)
    const width = (1 - 1.05 ** -roomSize.width) * 580 * 0.95
    const height = (1 - 1.05 ** -roomSize.height) * 580 * 0.95

    return (
      <div>
        <div id="container" style={{ margin: `0px auto`, width: `${width}px`, height: `${height}px` }}>
          <ContainerDimensionsWithScrollUpdates scrollTarget={window}>
            {rect => (
              <PositionController
                bounds={rect}
                isRound={roomShape === RoomShape.ROUND}
                objects={objects}
                listenerPosition={listenerPosition}
                headRadius={headRadius}
                sizeX = {roomSize.width/2}
                sizeZ = {roomSize.height/2}
                editingTarget={editingTarget}
                onSelectTarget={onSelectTarget}
                onPositionChange={(id, position) => onTargetMove(id, position)}
                onListenerChange={position => onListenerMove(position)}
              />
            )}
          </ContainerDimensionsWithScrollUpdates>
        </div>

        <div style={{textAlign: `center`}}>
          <PlaybackControlsContainer/>
        </div>


        <H3 style= {{textAlign: `center`, marginTop: `16px`}}>Reset Position</H3>

        <div style= {{textAlign: `center`}}>
          <ListenerResetButton key="resetL"
            onClick={() => onListenerMove({ azimuth: Math.PI / 2, distance: 0, rotYAxis: 0 })}

          >
            Listener
          </ListenerResetButton>

          <Button key="resetS" onClick={this.handleSourcesReset}>
            Sources
          </Button>
        </div>


        <H3 style={{textAlign: `center`, marginTop: `16px` }}>Room shape and size</H3>

        <ContainerDiv>

            <StyledDropDownMenu
              value={this.state.shape}
              onChange={this.handleDropDownChange}
              autoWidth={false}
              iconStyle={ddmIconStyle}
              labelStyle={ddmLabelStyle}
              listStyle={ddmListStyle}
              menuItemStyle={ddmMenuItemStyle}
              menuStyle={ddmMenuStyle}
              selectedMenuItemStyle={ddmSelectedMenuItemStyle}
              underlineStyle={ddmUnderlineStyle}
            >
              <MenuItem value={RoomShape.ROUND} primaryText="Round" />
              <MenuItem value={RoomShape.RECTANGULAR} primaryText="Rectangular" />
            </StyledDropDownMenu>

            <TextField
              id="width"
              type="text"
              value={gState.size.width}
              errorText={gState.errorTextW}
              floatingLabelFixed
              floatingLabelFocusStyle={tfFloatingLabelFocusStyle}
              floatingLabelStyle={tfFloatingLabelStyle}
              floatingLabelText="Width (m)"
              onChange={this.handleTextFieldChange}
              inputStyle={tfInputStyle}
              style={tfStyle}
              underlineFocusStyle={tfUnderlineFocusStyle}
              underlineStyle={tfUnderlineStyle}
            />

            <TextField
              id="height"
              type="text"
              value={gState.size.height}
              errorText={gState.errorTextH}
              floatingLabelFixed
              floatingLabelFocusStyle={tfFloatingLabelFocusStyle}
              floatingLabelStyle={tfFloatingLabelStyle}
              floatingLabelText="Height (m)"
              onChange={this.handleTextFieldChange}
              inputStyle={tfInputStyle}
              style={tfStyle}
              underlineFocusStyle={tfUnderlineFocusStyle}
              underlineStyle={tfUnderlineStyle}
            />

        </ContainerDiv>

        <H3 style={{textAlign: `center`, marginTop: `16px` }}>Source reach</H3>
        {editingTarget === null ? (
          <NoSelectedSourcePlaceholder>
            Select a source on the map to edit its reach
          </NoSelectedSourcePlaceholder>
        ) : (
          <Fragment>
            <SourceEditingWrapper>
              <SourceReachRadiusField>
                <Slider
                  value={targets[editingTarget].reach.radius}
                  min={0}
                  max={Math.max(roomSize.width, roomSize.height)}
                  step={0.5}
                  onChange={(event, newRadius) =>
                    onSetTargetReach(editingTarget, newRadius, targets[editingTarget].reach.fadeDuration)
                  }
                  sliderStyle={{ marginBottom: `4px`, marginTop: `0px` }}
                />
                <div>Reach: {targets[editingTarget].reach.radius} meters</div>
              </SourceReachRadiusField>

              <SourceReachFadeDurationField>
                <Slider
                  value={targets[editingTarget].reach.fadeDuration}
                  min={500}
                  max={10000}
                  step={250}
                  onChange={(event, newDuration) =>
                    onSetTargetReach(editingTarget, targets[editingTarget].reach.radius, newDuration)
                  }
                  sliderStyle={{ marginBottom: `4px`, marginTop: `0px` }}
                />
                <div>Fade: {targets[editingTarget].reach.fadeDuration / 1000} sec</div>
              </SourceReachFadeDurationField>
            </SourceEditingWrapper>

            <SourceEditingDoneButton onClick={() => onSelectTarget(null)}>
              Done
            </SourceEditingDoneButton>
          </Fragment>
        )}

      </div>
    )
  }
}

export function handleImportRoom(roomObject) {
  gState = {
    shape: roomObject.shape,
    size: roomObject.size,
    errorTextW: '',
    errorTextH: '',
  }
}

export default connect(
  state => ({
    listenerPosition: state.listener.position,
    headRadius: state.listener.headRadius,
    targets: state.target.targets,
    selected: state.target.selected,
    editingTarget: state.target.editing,
    roomShape: state.room.shape,
    roomSize: state.room.size,
  }),
  dispatch => ({
    onSelectTarget: (id) => dispatch(setEditingTarget(id)),
    onTargetMove: (id, position) => dispatch(setTargetPosition(id, position)),
    onSetTargetReach: (id, radius, fadeDuration) => dispatch(setTargetReach(id, radius, fadeDuration)),
    onListenerMove: position => dispatch(setListenerPosition(position)),
    onShapeChange: shape => dispatch(setRoomShape(shape)),
    onSizeChange: size => dispatch(setRoomSize(size)),
  })
)(PositionControllerContainer)
