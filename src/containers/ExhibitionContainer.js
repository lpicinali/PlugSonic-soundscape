import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { map } from 'lodash'
import * as colors from 'src/styles/colors.js'

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

import TextField from 'material-ui/TextField'
import FlatButton from "material-ui/FlatButton"
import Divider from 'material-ui/Divider'
import Chip from 'material-ui/Chip';
/* ========================================================================== */
export const textfieldStyle = {
  marginLeft: `20px`,
  width: `85%`
}
const underlineStyle = {
  borderColor: `colors.BLACK`,
}
const underlineFocusStyle = {
  borderColor: `colors.BLACK`,
}
const FlatButtonStyle = {
  width: '85%',
  margin: `auto`,
  marginTop:'10px',
  marginBottom: '10px',
  textColor: `${colors.WHITE}`,
}
const DividerStyle = {
  marginTop:'10px',
  marginBottom: '10px'
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
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
      type: "soundscape"
    }
    httpPostAsync(`${API}/exhibitions`, this.createExhibitionCallback, JSON.stringify(exhibition), sessionToken, "application/json")
  }

  createExhibitionCallback = (responseText) => {
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
      type: "soundscape"
    }

    httpPutAsync(`${API}/exhibitions/${this.state.exhibitionId}`, this.updateExhibitionCallback, JSON.stringify(exhibition), sessionToken, "application/json")
  }

  updateExhibitionCallback = (responseText) => {
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
    if(id === 'exhibitionTitle') {
      this.setState({ ...this.state, exhibitionTitle: val })
    } else if (id === 'exhibitionDescription') {
      this.setState({ ...this.state, exhibitionDescription: val })
    } else if (id === 'exhibitionNewTag') {
      this.setState({ ...this.state, exhibitionNewTag: val })
    }
  }

  handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault()
      const tags = this.state.exhibitionTags
      const newTagKey = tags.length
      const newTagLabel = e.target.value
      tags.push({key: newTagKey, label: newTagLabel})
      this.setState({ ...this.state, exhibitionNewTag: '', exhibitionTags: tags})
    }
  }

  handleRequestDelete = (key) => {
    const tags = this.state.exhibitionTags
    const tagToDelete = tags.map((tag) => tag.key).indexOf(key)
    tags.splice(tagToDelete, 1);
    this.setState({ ...this.state, exhibitionTags: tags });
  }

  /* ------------------------------------------------------------------------ */
  render() {

    // console.log(`TITLE = ${this.state.exhibitionTitle}`)

    return (
      <Container>

        <TextField
          id="exhibitionTitle"
          type="text"
          value={this.state.exhibitionTitle}
          floatingLabelFixed
          floatingLabelText="Title*"
          onChange={this.handleTextFieldChange}
          style={textfieldStyle}
          underlineFocusStyle={underlineFocusStyle}
          underlineStyle={underlineStyle}
        />

        <TextField
          id="exhibitionDescription"
          type="text"
          value={this.state.exhibitionDescription}
          floatingLabelFixed
          floatingLabelText="Description*"
          multiLine
          rows={2}
          rowsMax={4}
          onChange={this.handleTextFieldChange}
          style={textfieldStyle}
          underlineFocusStyle={underlineFocusStyle}
          underlineStyle={underlineStyle}
        />

        <TextField
          id="exhibitionNewTag"
          type="text"
          value={this.state.exhibitionNewTag}
          floatingLabelFixed
          floatingLabelText="Tags (Press ENTER to add)"
          onChange={this.handleTextFieldChange}
          onKeyUp={this.handleKeyUp}
          style={textfieldStyle}
          underlineFocusStyle={underlineFocusStyle}
          underlineStyle={underlineStyle}
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

        <FlatButton
          disabled={
            this.state.exhibitionTitle === '' || this.state.exhibitionDescription === ''
          }
          style={FlatButtonStyle}
          backgroundColor={
            this.state.exhibitionTitle === '' || this.state.exhibitionDescription === '' ?
            `${colors.LIGHTGREY}`:`${colors.BLACK}`
          }
          onClick={this.handleSaveExhibition}
          secondary
        >
          SAVE
        </FlatButton>

        <FlatButton
          disabled={
            this.state.exhibitionTitle === '' || this.state.exhibitionDescription === ''
          }
          style={FlatButtonStyle}
          backgroundColor={
            this.state.exhibitionTitle === '' || this.state.exhibitionDescription === '' ?
            `${colors.LIGHTGREY}`:`${colors.BLACK}`
          }
          onClick={this.handlePublishExhibition}
          secondary
        >
          PUBLISH
        </FlatButton>

        <Divider style={DividerStyle}/>

      </Container>
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

export default connect(mapStateToProps,mapDispatchToProps)(ExhibitionContainer)
