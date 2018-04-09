/* eslint react/prefer-stateless-function: 0 */
/* eslint react/forbid-prop-types: 0 */
/* eslint prefer-destructuring: 0 */

/* ------------------- NOTES -------------------- *//*

*//* ---------------------------------------------- */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { reduce, map } from 'lodash'
import got from 'got'

import {
  // setHeadRadius,
  // setPerformanceMode,
  setMasterVolume,
} from 'src/actions/controls.actions.js'
import {
  setTarget,
  setTargetVolume,
  addTarget,
  deleteTargets
} from 'src/actions/target.actions.js'
import {
  // setHeadRadius,
  // setPerformanceMode,
} from 'src/actions/listener.actions.js'
// import DirectionalityContainer from 'src/containers/DirectionalityContainer.js'
// import ButtonGroup from 'src/components/ButtonGroup.js'
import ButtonSliderGroup from 'src/components/ButtonSliderGroup.js'
// import Slider from 'src/components/Slider.js'
import MasterVolumeSlider from 'src/components/MasterVolumeSlider.js'
import { H2, H3 } from 'src/styles/elements.js'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import { autobind } from 'core-decorators';
import Button from 'src/components/Button.js'

/**
 * Target Selector Container
 */
class TargetSelectorContainer extends Component {
  static propTypes = {
    targets: PropTypes.object.isRequired,
    selected: PropTypes.array,
    masterVolume: PropTypes.number.isRequired,
    // isPerformanceModeEnabled: PropTypes.bool.isRequired,
    // headRadius: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    onChangeTargetVolume: PropTypes.func.isRequired,
    onChangeMasterVolume: PropTypes.func.isRequired,
    onAddSource: PropTypes.func.isRequired,
    onDeleteSource: PropTypes.func.isRequired,
    // onChangePerformanceMode: PropTypes.func.isRequired,
    // onChangeHeadRadius: PropTypes.func.isRequired,
  }

  static defaultProps = {
    selected: [],
  }

  state = {
    title: '',
    filename: '',
    url: '',
    errorTextT: '',
    errorTextF: '',
    errorTextU: '',
  }



  @autobind
  handleTextFieldChange(event) {
    const val = event.target.value;

    if ( event.target.id === 'title' ) {
      const titles = map(this.props.targets, file => file.title)
      if (titles.indexOf(val) >= 0) {
        this.setState({ ...this.state, title: val, errorTextT: `Already in use` });
      } else {
        this.setState({ ...this.state, title: val, errorTextT: '' });
      }
    } else if ( event.target.id === 'filename' ) {
      const filenames = map(this.props.targets, file => file.filename)
      if (filenames.indexOf(val) >= 0) {
        this.setState({ ...this.state, filename: val, errorTextF: `Already in use` });
      } else {
        this.setState({ ...this.state, filename: val, errorTextF: '' });
      }
    } else if ( event.target.id === 'url' ) {
      const urls = map(this.props.targets, file => file.url)
      if (urls.indexOf(val) >= 0) {
        this.setState({ ...this.state, url: val, errorTextU: `Already in use` });
      } else {
        this.setState({ ...this.state, url: val, errorTextU: '' });
      }
    }
  }

  @autobind
  handleAddSource() {

    let url = this.state.url
    const begin = 'https://www.dropbox.com/'
    const newBegin = 'https://dl.dropboxusercontent.com/'

    if ( url.startsWith(begin) ) {
      url = url.slice(begin.length, url.length)
      url = newBegin.concat(url)

      got(url, { encoding: null })
        .then(response => {
          console.log('SUCCESS')
          console.log(`response.url: ${response.url}`);
          // console.log(`response.statusCode: ${response.statusCode}`);
          // console.log(`response.statusMessage: ${response.statusMessage}`);
          this.props.onAddSource(this.state.title, this.state.filename, url)
          this.setState({ ...this.state, title: '', filename: '', url: '', errorTextT: '', errorTextF: '', errorTextU: '', });
        })
        .catch(err => {
          console.log('ERROR')
          console.log(err)
          this.setState({ ...this.state, errorTextU: `URL response error` })
        })
    } else {
      this.setState({ ...this.state, errorTextU: 'Invalid URL' });
    }
  }

  render() {
    const {
      targets,
      selected,
      masterVolume,
      // isPerformanceModeEnabled,
      // headRadius,
      onSelect,
      onChangeTargetVolume,
      onChangeMasterVolume,
      // onChangePerformanceMode,
      // onChangeHeadRadius,
    } = this.props;

    // const options = reduce(
    //   targets,
    //   (aggr, file) => ({
    //     ...aggr,
    //     [file.filename]: file.title,
    //   }),
    //   {}
    // );


    const options = reduce(
      targets,
      (aggr, file) => ({
        ...aggr,
        [file.filename]: {
          id: file.filename,
          label: file.title,
          url: file.url,
          volume: file.volume
      }}),
      {}
    );

    // List of buttons
    // options = { file#0.filename: file#0.title#0 ... file#N.filename: file#N.title }
    // enabledOption = [ file#0.filename , ... , file#N.filename ]
    // value = targets.selected
    // isVertical = true
    // onSelect = setTarget(targets.selected)


    // onChange={(id, volume) => onChangeTargetVolume(id, volume)}
    return (
      <div>
        <H2>Soundscape</H2>

        <div>
          <H3>Add Source</H3>
          <div>
            <MuiThemeProvider>
              <TextField
                id='title'
                type='text'
                value={this.state.title}
                errorText={this.state.errorTextT}
                floatingLabelText='Title'
                onChange={this.handleTextFieldChange}
                style={{width: `40%`, paddingRight: `5%`, float: `left`}}
              />
            </MuiThemeProvider>
            <MuiThemeProvider>
              <TextField
                id='filename'
                type='text'
                value={this.state.filename}
                errorText={this.state.errorTextF}
                floatingLabelText='Filename'
                onChange={this.handleTextFieldChange}
                style={{width: `40%`, paddingLeft: `5%`}}
              />
            </MuiThemeProvider>
          </div>
          <div>
            <MuiThemeProvider>
              <TextField
                id='url'
                type='url'
                value={this.state.url}
                errorText={this.state.errorTextU}
                floatingLabelText='Dropbox URL'
                onChange={this.handleTextFieldChange}
                style={{width: `50%`}}
              />
            </MuiThemeProvider>
          </div>

          <Button
            key='add'
            onClick={this.handleAddSource}
            style={{float: `left`}}
          >
            Add Source
          </Button>
          <Button
            key='delete'
            onClick={() => this.props.onDeleteSource(this.props.selected)}
            style={{float: `left`}}
          >
            Delete Selected
          </Button>

        </div>

        <div>
          <H3>Sources</H3>
          <ButtonSliderGroup
            options={options}
            enabledOptions={Object.keys(options)}
            value={selected}
            isVertical
            onSelect={onSelect}
            onVolumeChange={(id, volume) => onChangeTargetVolume(id, volume)}
          />
        </div>

        <div style={{ display: 'flex' }}>
          <div style={{ paddingRight: 16 }}>
            <H3>Master Volume</H3>
            <MasterVolumeSlider volume={masterVolume} onChange={onChangeMasterVolume} />
          </div>
        </div>

      </div>
    )
  }
}

export default connect(
  state => ({
    targets: state.target.targets,
    selected: state.target.selected,
    masterVolume: state.controls.masterVolume,
    // isPerformanceModeEnabled: state.controls.isPerformanceModeEnabled,
    // headRadius: state.controls.headRadius,
  }),
  dispatch => ({
    onSelect: (target, url) => dispatch(setTarget(target, url)),
    onChangeTargetVolume: (id, volume) => dispatch(setTargetVolume(id, volume)),
    onChangeMasterVolume: volume => dispatch(setMasterVolume(volume)),
    onAddSource: (title, filename, url) => dispatch(addTarget(title, filename, url)),
    onDeleteSource: targets => dispatch(deleteTargets(targets))
    // onChangePerformanceMode: isEnabled =>
    //   dispatch(setPerformanceMode(isEnabled)),
    // onChangeHeadRadius: radius => dispatch(setHeadRadius(radius)),
  })
)(TargetSelectorContainer)
