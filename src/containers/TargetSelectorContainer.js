/* eslint react/prefer-stateless-function: 0 */
/* eslint react/forbid-prop-types: 0 */
/* eslint prefer-destructuring: 0 */

/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { reduce, map } from 'lodash'
import got from 'got'

import { setMasterVolume } from 'src/actions/controls.actions.js'
import { setTarget, setTargetVolume, addTarget, deleteTargets,
  } from 'src/actions/target.actions.js'

import ButtonSliderGroup from 'src/components/ButtonSliderGroup.js'
import MasterVolumeSlider from 'src/components/MasterVolumeSlider.js'
import Uploader from 'src/components/Uploader.js'
import { H2, H3 } from 'src/styles/elements.js'

import TextField from 'material-ui/TextField'
import styled from 'styled-components'
import { autobind } from 'core-decorators'
import Button from 'src/components/Button.js'

const StyledTextField = styled(TextField)`
  width: 40% !important;
  margin-right: 10%;
  margin-top: -20px;
`

/**
 * Target Selector Container
 */
class TargetSelectorContainer extends Component {
  static propTypes = {
    targets: PropTypes.object.isRequired,
    selected: PropTypes.array,
    masterVolume: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    onChangeTargetVolume: PropTypes.func.isRequired,
    onChangeMasterVolume: PropTypes.func.isRequired,
    onAddSource: PropTypes.func.isRequired,
    onDeleteSource: PropTypes.func.isRequired,
  }

  static defaultProps = {
    selected: [],
  }

  state = {
    title: '',
    url: '',
    errorTextT: '',
    errorTextU: '',
  }

  @autobind
  handleTextFieldChange(event) {
    const val = event.target.value

    if (event.target.id === 'title') {
      const titles = map(this.props.targets, file => file.title)
      if (titles.indexOf(val) >= 0) {
        this.setState({
          ...this.state,
          title: val,
          errorTextT: `Already in use`,
        })
      } else {
        this.setState({ ...this.state, title: val, errorTextT: '' })
      }
    }
    else if (event.target.id === 'url') {
      const urls = map(this.props.targets, file => file.url)
      if (urls.indexOf(val) >= 0) {
        this.setState({ ...this.state, url: val, errorTextU: `Already in use` })
      } else {
        this.setState({ ...this.state, url: val, errorTextU: '' })
      }
    }
  }

  @autobind
  handleAddSource() {
    let url = this.state.url
    const begin = 'https://www.dropbox.com/'
    const newBegin = 'https://dl.dropboxusercontent.com/'

    if (url.startsWith(begin)) {
      url = url.slice(begin.length, url.length)
      url = newBegin.concat(url)

      got(url, { encoding: null })
        .then(() => {
          const title = this.state.title.trim()
          const filename = title.replace(/\s/g,'').toLowerCase()
          this.props.onAddSource(title, filename, url, [])
          this.setState({
            ...this.state,
            title: '',
            url: '',
            errorTextT: '',
            errorTextU: '',
          })
        })
        .catch(err => {
          console.log('ERROR')
          console.log(err)
          this.setState({ ...this.state, errorTextU: `URL response error` })
        })
    } else {
      this.setState({ ...this.state, errorTextU: 'Invalid URL' })
    }
  }

  render() {
    const {
      targets,
      selected,
      masterVolume,
      onSelect,
      onChangeTargetVolume,
      onChangeMasterVolume,
    } = this.props

    const options = reduce(
      targets,
      (aggr, file) => ({
        ...aggr,
        [file.filename]: {
          id: file.filename,
          label: file.title,
          url: file.url,
          volume: file.volume,
        },
      }),
      {}
    )

    const titles = map(targets, file => file.title)

    return (
      <div>
        <H2>Soundscape</H2>

        <div>
          <H3>Add Source</H3>
          <H3>Drag and drop</H3>
          <Uploader
            titles={titles}
            onAddSource={this.props.onAddSource}
          />

          <div>
            <H3>Load from dropbox</H3>

              <StyledTextField
                id="title"
                type="text"
                value={this.state.title}
                errorText={this.state.errorTextT}
                floatingLabelText="Title"
                onChange={this.handleTextFieldChange}
              />

              <StyledTextField
                id="url"
                type="url"
                value={this.state.url}
                errorText={this.state.errorTextU}
                floatingLabelText="Dropbox URL"
                onChange={this.handleTextFieldChange}
              />

          </div>

          <div style={{ paddingTop: 18 }}>
            <Button
              key="add"
              onClick={this.handleAddSource}
              style={{ float: `left` }}
            >
              Add Source
            </Button>
            <Button
              key="delete"
              onClick={() => this.props.onDeleteSource(this.props.selected)}
            >
              Delete Selected
            </Button>
          </div>
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
            <MasterVolumeSlider
              volume={masterVolume}
              onChange={onChangeMasterVolume}
            />
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
  }),
  dispatch => ({
    onSelect: (target, url) => dispatch(setTarget(target, url)),
    onChangeTargetVolume: (id, volume) => dispatch(setTargetVolume(id, volume)),
    onChangeMasterVolume: volume => dispatch(setMasterVolume(volume)),
    onAddSource: (title, filename, url, raw) =>
      dispatch(addTarget(title, filename, url, raw)),
    onDeleteSource: targets => dispatch(deleteTargets(targets)),
  })
)(TargetSelectorContainer)
