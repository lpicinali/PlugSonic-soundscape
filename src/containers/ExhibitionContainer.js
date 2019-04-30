import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { map } from 'lodash'
import { Button, Chip, TextField } from '@material-ui/core'

import {
  API,
  exhibitionId,
  exhibitionTitle,
  exhibitionDescription,
  exhibitionTags,
  httpPostAsync,
  httpPutAsync,
  sessionToken,
} from 'src/pluggy'
import { FieldBox } from 'src/styles/elements'

/* ========================================================================== */

const chipStyle = {
  margin: 4,
}
const ChipWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: 20px;
`
/* ========================================================================== */

/* ========================================================================== */
/* EXHIBITION CONTAINER */
/* ========================================================================== */
class ExhibitionContainer extends Component {
  state = {
    exhibitionTitle: exhibitionTitle,
    exhibitionDescription: exhibitionDescription,
    exhibitionNewTag: '',
    exhibitionTags: exhibitionTags,
    exhibitionId: exhibitionId,
  }

  createExhibition = () => {
    // soundscape object
    const soundscape = {
      sources: this.props.sources,
      listener: this.props.listener,
      room: this.props.room,
    }
    console.log('CREATE')
    console.log(soundscape)
    // exhibition object
    const exhibition = {
      title: this.state.exhibitionTitle,
      public: false,
      description: this.state.exhibitionDescription,
      metadata: soundscape,
      tags: this.state.exhibitionTags.map(tag => tag.label),
      type: 'soundscape',
    }
    httpPostAsync(
      `${API}/exhibitions`,
      this.createExhibitionCallback,
      JSON.stringify(exhibition),
      sessionToken,
      'application/json'
    )
  }

  createExhibitionCallback = responseText => {
    const createdExhibition = JSON.parse(responseText)
    console.log(createdExhibition)
    this.state.exhibitionId = createdExhibition.data._id
  }

  updateExhibition = () => {
    // soundscape object
    const soundscape = {
      sources: this.props.sources,
      listener: this.props.listener,
      room: this.props.room,
    }

    soundscape.sources = map(soundscape.sources, source => source)

    // exhibition object
    const exhibition = {
      title: this.state.exhibitionTitle,
      public: this.state.exhibitionPublic,
      description: this.state.exhibitionDescription,
      metadata: soundscape,
      tags: this.state.exhibitionTags.map(tag => tag.label),
      type: 'soundscape',
    }

    httpPutAsync(`${API}/exhibitions/${this.state.exhibitionId}`, this.updateExhibitionCallback, JSON.stringify(exhibition), sessionToken, "application/json")
  }

  updateExhibitionCallback = responseText => {
    const updatedExhibition = JSON.parse(responseText)
    console.log(updatedExhibition)
  }

  handleSaveExhibition = () => {
    if (this.state.exhibitionId) {
      this.updateExhibition()
    } else {
      this.createExhibition()
    }
  }

  handlePublishExhibition = () => {
    // exhibition object
    const exhibition = {
      public: true,
    }

    httpPutAsync(`${API}/exhibitions/${this.state.exhibitionId}`, this.publishExhibitionCallback, JSON.stringify(exhibition), sessionToken, "application/json")
  }

  publishExhibitionCallback = (responseText) => {
    const publishedExhibition = JSON.parse(responseText)
    console.log(publishedExhibition)
  }

  handleTextFieldChange = (event) => {
    const id = event.target.id
    const val = event.target.value
    if (id === 'exhibitionTitle') {
      this.setState({ ...this.state, exhibitionTitle: val })
    } else if (id === 'exhibitionDescription') {
      this.setState({ ...this.state, exhibitionDescription: val })
    } else if (id === 'exhibitionNewTag') {
      this.setState({ ...this.state, exhibitionNewTag: val })
    }
  }

  handleKeyUp = e => {
    if (e.keyCode === 13) {
      e.preventDefault()
      const tags = this.state.exhibitionTags
      const newTagKey = tags.length
      const newTagLabel = e.target.value
      tags.push({ key: newTagKey, label: newTagLabel })
      this.setState({
        ...this.state,
        exhibitionNewTag: '',
        exhibitionTags: tags,
      })
    }
  }

  handleRequestDelete = key => {
    const tags = this.state.exhibitionTags
    const tagToDelete = tags.map(tag => tag.key).indexOf(key)
    tags.splice(tagToDelete, 1)
    this.setState({ ...this.state, exhibitionTags: tags })
  }

  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <Fragment>
        <TextField
          id="exhibitionTitle"
          type="text"
          fullWidth
          value={this.state.exhibitionTitle}
          label="Title*"
          onChange={this.handleTextFieldChange}
        />

        <TextField
          id="exhibitionDescription"
          type="text"
          fullWidth
          value={this.state.exhibitionDescription}
          label="Description*"
          multiline
          rows={2}
          rowsMax={4}
          onChange={this.handleTextFieldChange}
        />

        <TextField
          id="exhibitionNewTag"
          type="text"
          fullWidth
          value={this.state.exhibitionNewTag}
          label="Tags (Press ENTER to add)"
          onChange={this.handleTextFieldChange}
          onKeyUp={this.handleKeyUp}
        />

        <ChipWrapper>
          {this.state.exhibitionTags.map(tag => (
            <Chip
              key={tag.key}
              onRequestDelete={() => this.handleRequestDelete(tag.key)}
              style={chipStyle}
            >
              {tag.label}
            </Chip>
          ))}
        </ChipWrapper>

        <FieldBox>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={this.state.exhibitionTitle === '' || this.state.exhibitionDescription === ''}
            onClick={this.handleSaveExhibition}
          >
            SAVE
          </Button>
        </FieldBox>

        <FieldBox>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={this.state.exhibitionTitle === '' || this.state.exhibitionDescription === ''}
            onClick={this.handleSaveExhibition}
          >
            PUBLISH
          </Button>
        </FieldBox>
      </Fragment>
    )
  }
}

ExhibitionContainer.propTypes = {
  // sources: PropTypes.object.isRequired,
  // onAddSource: PropTypes.func.isRequired,
  listener: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
  sources: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  listener: state.listener,
  room: state.room,
  sources: state.sources.sources,
})

const mapDispatchToProps = dispatch => ({
  // onAddSource: (filename, name, url, assetId, mediaId) =>
  //   dispatch(addSourceRemote(filename, name, url, assetId, mediaId)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExhibitionContainer)
