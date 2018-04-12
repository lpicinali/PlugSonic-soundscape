/* global window */
/* eslint react/prefer-stateless-function: 0 */
/* eslint react/forbid-prop-types: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint no-lonely-if: 0 */

/* ------------------- NOTES -------------------- *//*

  TO DO:
  - tune roome resizing function

*//* ---------------------------------------------- */

import React, { Component, Fragment } from 'react'
// import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import styled from 'styled-components'
import { autobind } from 'core-decorators'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Slider from 'material-ui/Slider'
import TextField from 'material-ui/TextField';
import { RoomShape } from 'src/constants.js'
import { values, toNumber, isNaN, forEach } from 'lodash'

// import * as CustomPropTypes from 'src/prop-types.js'
import { setEditingTarget, setTargetPosition, setTargetReach } from 'src/actions/target.actions.js'
import { setListenerPosition } from 'src/actions/listener.actions.js'
import { setRoomShape, setRoomSize } from 'src/actions/room.actions.js'
import ContainerDimensionsWithScrollUpdates from 'src/components/ContainerDimensionsWithScrollUpdates.js'
import PositionController from 'src/components/PositionController.js'
import Button from 'src/components/Button.js'

import { H3 } from 'src/styles/elements.js'

// const BoundsRelay = rect => {}

const minWidth = 3;
const maxWidth = 100;
const minHeight = 3;
const maxHeight = 100;

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
    onSizeChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    editingTarget: null,
  }

  state = {
    size: { width: 20, height: 10 },
    errorTextW: '',
    errorTextH: ''
  };

  @autobind
  handleDropDownChange(event, index, value){
    if(value === 'ROUND') {
      this.props.onShapeChange(RoomShape.ROUND);
      const newSize = { width: this.props.roomSize.width, height: this.props.roomSize.width }
      this.setState({ ...this.state, size: newSize });
      this.props.onSizeChange(newSize);
    } else if (value === 'RECTANGULAR') {
      this.props.onShapeChange(RoomShape.RECTANGULAR);
    }
  }

  @autobind
  handleSourcesReset(){
    let index = 0;
    forEach(
      this.props.targets,
      target => {
        const id = target.filename;
        const position = {
          'azimuth':index * Math.PI/6,
          'distance': Math.min(this.props.roomSize.width,this.props.roomSize.height)/4};
        this.props.onTargetMove(id, position);
        index += 1;
      }
    );
  }

  @autobind
  handleTextFieldChange(event) {
    const val = event.target.value;
    if ( this.props.roomShape === RoomShape.ROUND ) {
      if ( !isNaN(toNumber(val)) ) {
        if ( val >= minWidth && val <= maxWidth ) {
          const newSize = { width: toNumber(val), height: toNumber(val) };
          this.setState({
            ...this.state, size: newSize, errorTextW: '', errorTextH: ''
          });
          this.props.onSizeChange(newSize);
        } else {
          const newSize = { width: toNumber(val), height: toNumber(val) };
          this.setState({
            ...this.state, size: newSize,
            errorTextW: `Invalid: ${minWidth} < W < ${maxWidth}`, errorTextH: ''
          });
        }
      } else {
        const newSize = { ...this.state.size, width: val };
        this.setState({
          ...this.state, size: newSize, errorTextW: 'Invalid: NaN', errorTextH: ''
        });
      }
    } else {
      if ( event.target.id === 'width' ) {
        if ( !isNaN(toNumber(val)) ) {
          if ( val >= minWidth && val <= maxWidth ) {
            const newSize = { ...this.state.size, width: toNumber(val) };
            this.setState({
              ...this.state, size: newSize, errorTextW: ''
            });
            this.props.onSizeChange(newSize);
          } else {
            const newSize = { ...this.state.size, width: toNumber(val) };
            this.setState({
              ...this.state, size: newSize, errorTextW: `Invalid: ${minWidth} < W < ${maxWidth}`
            });
          }
        } else {
          const newSize = { ...this.state.size, width: val };
          this.setState({
            ...this.state, size: newSize, errorTextW: 'Invalid: NaN'
          });
        }
      } else {
        if ( !isNaN(toNumber(val)) ) {
          if ( val >= minHeight && val <= maxHeight ) {
            const newSize = { ...this.state.size, height: toNumber(val), };
            this.setState({
              ...this.state, size: newSize, errorTextH: ''
            });
            this.props.onSizeChange(newSize);
          } else {
            const newSize = { ...this.state.size, height: toNumber(val), };
            this.setState({
              ...this.state, size: newSize, errorTextH: `Invalid: ${minHeight} < H < ${maxHeight}`
            });
          }
        } else {
          const newSize = { ...this.state.size, height: val, };
          this.setState({
            ...this.state, size: newSize, errorTextH: 'Invalid: NaN'
          });
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

    return (
      <div>
        <div id='container'
          style={{
          position: 'relative',
          width: `${(1 - (1.05 ** (-roomSize.width)))*360*0.95}px`,
          height: `${(1 - (1.05 ** (-roomSize.height)))*360*0.95}px`,
        }}>
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

        <div>
          <H3>Reset</H3>

            <Button
              key='resetL'
              onClick={() => onListenerMove({ azimuth: Math.PI/2, distance: 0, rotYAxis: 0 })}
              style={{float: `left`, marginRight: `20px`}}
            >
              Listener
            </Button>
            <Button
              key='resetS'
              onClick={this.handleSourcesReset}
            >
              Sources
            </Button>

        </div>

        <H3>Room shape and size</H3>
        <div>
          <MuiThemeProvider>
              <DropDownMenu value={roomShape} onChange={this.handleDropDownChange} autoWidth={false} style={{width: `50%`}}>
                <MenuItem value={RoomShape.ROUND} primaryText="Round" />
                <MenuItem value={RoomShape.RECTANGULAR} primaryText="Rectangular" />
              </DropDownMenu>
          </MuiThemeProvider>
        </div>
        <MuiThemeProvider>
          <TextField
            id='width'
            type='text'
            value={this.state.size.width}
            errorText={this.state.errorTextW}
            floatingLabelText='Width (m)'
            onChange={this.handleTextFieldChange}
            style={{width: `35%`, paddingRight: `5%`, float: `left`}}
          />
        </MuiThemeProvider>
        <MuiThemeProvider>
          <TextField
            id='height'
            type='text'
            value={this.state.size.height}
            errorText={this.state.errorTextH}
            floatingLabelText='Height (m)'
            onChange={this.handleTextFieldChange}
            disabled={roomShape === RoomShape.ROUND}
            style={{width: `35%`, paddingLeft: `5%`}}
          />
        </MuiThemeProvider>

        <H3>Source reach</H3>
        {editingTarget === null ? (
          <p>Select a target first</p>
        ) : (
          <Fragment>
            <MuiThemeProvider>
              <Slider
                name="reach"
                value={targets[editingTarget].reach}
                min={0}
                max={Math.max(roomSize.width, roomSize.height)}
                step={0.5}
                onChange={(event, newReach) => onSetTargetReach(editingTarget, newReach)}
                sliderStyle={{
                  marginBottom: 16,
                }}
              />
            </MuiThemeProvider>

            <p>{targets[editingTarget].reach} m</p>
          </Fragment>
        )}
      </div>
    )
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
    roomSize: state.room.size
  }),
  dispatch => ({
    onSelectTarget: (id) => dispatch(setEditingTarget(id)),
    onTargetMove: (id, position) => dispatch(setTargetPosition(id, position)),
    onSetTargetReach: (id, reach) => dispatch(setTargetReach(id, reach)),
    onListenerMove: position => dispatch(setListenerPosition(position)),
    onShapeChange: shape => dispatch(setRoomShape(shape)),
    onSizeChange: size => dispatch(setRoomSize(size))
  })
)(PositionControllerContainer)
