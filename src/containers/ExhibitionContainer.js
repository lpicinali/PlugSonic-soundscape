import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { map } from 'lodash'
import {
  Button,
  Chip,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'

import {
  setDescription,
  setPublished,
  setTags,
  setTitle,
} from 'src/actions/exhibition.actions.js'
import {
  API,
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
`
/* ========================================================================== */

/* ========================================================================== */
/* EXHIBITION CONTAINER */
/* ========================================================================== */
class ExhibitionContainer extends Component {
  state = {
    exhibitionNewTag: '',
    isSaveDialogOpen: false,
    saveDialogText: '',
    isPublishDialogOpen: false,
    publishDialogText: '',
  }
  /* -------------------- CREATE EXHIBITION ------------------*/
  createExhibition = () => {
    // soundscape object
    const soundscape = {
      listener: this.props.listener,
      room: this.props.room,
      sources: this.props.sources,
    }

    soundscape.sources = map(soundscape.sources, source => source)

    // exhibition object
    const exhibition = {
      description: this.props.exhibition.description,
      metadata: soundscape,
      public: false,
      tags: this.props.exhibition.tags.map(tag => tag.label),
      title: this.props.exhibition.title,
      type: 'soundscape',
    }

    console.log('Create Exhibition...')
    console.log(exhibition)

    httpPostAsync(
      `${API}/exhibitions`,
      this.createExhibitionCallback,
      this.createExhibitionErrorCallback,
      JSON.stringify(exhibition),
      sessionToken,
      "application/json"
    )
  }

  createExhibitionCallback = responseText => {
    const createdExhibition = JSON.parse(responseText)
    console.log('createExhibitionCallback')
    console.log(createdExhibition)
    // this.props.exhibition.id = createdExhibition.data._id
    // SET Description
    // SET EXHIBITION_ID etc. etc.
  }

  createExhibitionErrorCallback = responseText => {
    const error = JSON.parse(responseText)
    console.log('createExhibitionErrorCallback')
    console.log(error)
  }
  /* -------------------- UPDATE EXHIBITION ------------------*/
  updateExhibition = () => {
    // soundscape object
    const soundscape = {
      listener: this.props.listener,
      room: this.props.room,
      sources: this.props.sources,
    }

    soundscape.sources = map(soundscape.sources, source => source)

    // exhibition object
    const exhibition = {
      description: this.props.exhibition.description,
      metadata: soundscape,
      public: this.props.exhibition.isPublished,
      tags: this.props.exhibition.tags.map(tag => tag.label),
      title: this.props.exhibition.title,
      type: 'soundscape',
    }

    console.log('Update Exhibition...')
    console.log(exhibition)

    httpPutAsync(
      `${API}/exhibitions/${this.props.exhibition.id}`,
      this.updateExhibitionCallback,
      this.updateExhibitionErrorCallback,
      JSON.stringify(exhibition),
      sessionToken,
      "application/json"
    )
  }

  updateExhibitionCallback = responseText => {
    const updatedExhibition = JSON.parse(responseText)
    console.log(updatedExhibition)
    this.setState({
      isSaveDialogOpen: true,
      saveDialogText: 'Save Exhibition Successfull'
    })
  }

  updateExhibitionErrorCallback = responseText => {
    const updatedExhibition = JSON.parse(responseText)
    console.log(updatedExhibition)
    this.setState({
      isSaveDialogOpen: true,
      saveDialogText: 'Save Exhibition Unsuccessfull. Try Again.'
    })
  }
  /* -------------------- SAVE EXHIBITION ------------------*/
  handleSaveExhibition = () => {
    if (this.props.exhibition.id) {
      this.updateExhibition()
    } else {
      this.createExhibition()
    }
  }

  /* -------------------- PUBLISH EXHIBITION ------------------*/
  handlePublishExhibition = () => {
    // exhibition object
    const exhibition = {
      public: !this.props.exhibition.isPublished,
    }

    httpPutAsync(
      `${API}/exhibitions/${this.props.exhibition.id}`,
      this.publishExhibitionCallback,
      this.publishExhibitionErrorCallback,
      JSON.stringify(exhibition),
      sessionToken,
      "application/json"
    )
  }

  publishExhibitionCallback = (responseText) => {
    const publishExhibition = JSON.parse(responseText)
    console.log(publishExhibition)
    this.setState({
      isPublishDialogOpen: true,
      publishDialogText: this.props.exhibition.isPublished ? 'Unpublish Exhibition Successfull':'Publish Exhibition Successfull'
    })
    this.props.onSetPublished(publishExhibition.data.public)
  }

  publishExhibitionErrorCallback = (responseText) => {
    const publishExhibition = JSON.parse(responseText)
    console.log(publishExhibition)
    this.setState({
      isPublishDialogOpen: true,
      publishDialogText: this.props.exhibition.isPublished ? 'Unpublish Exhibition Unsuccessfull. Try Again.':'Publish Exhibition Unuccessfull. Try Again'
    })
    this.props.onSetPublished(publishExhibition.data.public)
  }

  /* -------------------- TAGS EXHIBITION ------------------*/
  handleTextFieldChange = (event) => {
    const id = event.target.id
    const val = event.target.value
    if (id === 'exhibitionTitle') {
      this.props.onSetTitle(val)
    } else if (id === 'exhibitionDescription') {
      this.props.onSetDescription(val)
    } else if (id === 'exhibitionNewTag') {
      this.setState({ ...this.state, exhibitionNewTag: val })
    }
  }

  handleKeyUp = e => {
    if (e.keyCode === 13) {
      e.preventDefault()
      const tags = this.props.exhibition.tags
      const newTagKey = tags.length
      const newTagLabel = e.target.value
      tags.push({ key: newTagKey, label: newTagLabel })
      this.setState({
        ...this.state,
        exhibitionNewTag: '',
      })
      this.props.onSetTags(tags)
    }
  }

  handleRequestDelete = key => {
    const tags = this.props.exhibition.tags
    const tagToDelete = tags.map(tag => tag.key).indexOf(key)
    tags.splice(tagToDelete, 1)
    this.props.onSetTags(tags)
  }

  /* ------------------------------------------------------------------------ */
  render() {
    return (
      <Fragment>
        <TextField
          id="exhibitionTitle"
          type="text"
          fullWidth
          value={this.props.exhibition.title}
          label="Title*"
          onChange={this.handleTextFieldChange}
        />

        <TextField
          id="exhibitionDescription"
          type="text"
          fullWidth
          value={this.props.exhibition.description}
          label="Description*"
          multiline
          rows={2}
          rowsMax={8}
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
          {this.props.exhibition.tags.map(tag => (
            <Chip
              key={tag.key}
              label={tag.label}
              onDelete={() => this.handleRequestDelete(tag.key)}
              style={chipStyle}
            />
          ))}
        </ChipWrapper>

        <FieldBox>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={this.props.exhibition.title === '' || this.props.exhibition.description === ''}
            onClick={this.handleSaveExhibition}
          >
            SAVE
          </Button>

          <Dialog
            open={this.state.isSaveDialogOpen}
          >
            <DialogTitle>Save Exhibition</DialogTitle>

            <DialogContent>
              <DialogContentText>
                {this.state.saveDialogText}
              </DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.setState({ isSaveDialogOpen: false })}
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </FieldBox>

        <FieldBox>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={this.props.exhibition.title === '' || this.props.exhibition.description === ''}
            onClick={this.handlePublishExhibition}
          >
            {this.props.exhibition.isPublished ? 'UNPUBLISH':'PUBLISH'}
          </Button>

          <Dialog
            open={this.state.isPublishDialogOpen}
          >
            <DialogTitle>Publish Exhibition</DialogTitle>

            <DialogContent>
              <DialogContentText>
                {this.state.publishDialogText}
              </DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.setState({ isPublishDialogOpen: false })}
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </FieldBox>
      </Fragment>
    )
  }
}

ExhibitionContainer.propTypes = {
  exhibition: PropTypes.object.isRequired,
  listener: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
  sources: PropTypes.object.isRequired,
  onSetDescription: PropTypes.func.isRequired,
  onSetPublished: PropTypes.func.isRequired,
  onSetTags: PropTypes.func.isRequired,
  onSetTitle: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  exhibition: state.exhibition,
  listener: state.listener,
  room: state.room,
  sources: state.sources.sources,
})

const mapDispatchToProps = dispatch => ({
  onSetDescription: description => dispatch(setDescription(description)),
  onSetPublished: isPublished => dispatch(setPublished(isPublished)),
  onSetTags: tags => dispatch(setTags(tags)),
  onSetTitle: title => dispatch(setTitle(title)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExhibitionContainer)
