import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { reduce, map } from 'lodash'
import got from 'got'
import * as colors from 'src/styles/colors.js'

import {
  API,
  httpGetAsync,
  httpPostAsync,
  httpPutAsync,
  sessionToken,
} from 'src/pluggy'

import TextField from 'material-ui/TextField'
import FlatButton from "material-ui/FlatButton"
import Divider from 'material-ui/Divider'
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
/* ========================================================================== */

/* ========================================================================== */
/* EXHIBITION CONTAINER */
/* ========================================================================== */
class ExhibitionContainer extends Component {

  state = {
    exhibitionTitle: '',
    exhibitionDescription: '',
    exhibitionTags: [],
    exhibitionId: null,
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
    const clone = JSON.parse(JSON.stringify(soundscape))
    // exhibition object
    const exhibition = {
      title: this.state.exhibitionTitle,
      public: false,
      description: this.state.exhibitionDescription,
      metadata: soundscape,
      tags: this.state.exhibitionTags,
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
    console.log('UPDATE')
    console.log(soundscape)
    const clone = JSON.parse(JSON.stringify(soundscape))
    // exhibition object
    const exhibition = {
      title: this.state.exhibitionTitle,
      description: this.state.exhibitionDescription,
      metadata: soundscape,
      tags: this.state.exhibitionTags,
      type: "soundscape"
    }
    const exhibitionId = this.state.exhibitionId
    httpPutAsync(`${API}/exhibitions/${exhibitionId}`, this.updateExhibitionCallback, JSON.stringify(exhibition), sessionToken, "application/json")
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

  handleTextFieldChange = (event) => {
    const val = event.target.value
    this.setState({ ...this.state, exhibitionTitle: val})
  }

  /* ------------------------------------------------------------------------ */
  render() {

    return (
      <Container>

        <TextField
          id="exhibitionTitle"
          type="text"
          value={this.state.exhibitionTitle}
          floatingLabelFixed
          floatingLabelText="Title"
          onChange={this.handleTextFieldChange}
          style={textfieldStyle}
          underlineFocusStyle={underlineFocusStyle}
          underlineStyle={underlineStyle}
        />

        <FlatButton
          disabled={this.state.exhibitionTitle === ''}
          style={FlatButtonStyle}
          backgroundColor={`${colors.BLACK}`}
          onClick={this.handleSaveExhibition}
          secondary
        >
          SAVE
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
