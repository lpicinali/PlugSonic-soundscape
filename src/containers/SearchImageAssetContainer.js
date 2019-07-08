import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Autosuggest from 'react-autosuggest'
import { map } from 'lodash'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import {
  Button,
  Divider,
  MenuItem,
  Paper,
  TextField,
} from '@material-ui/core'

import { API, httpHintAsync, httpGetAsync } from 'src/pluggy.js'
import { setRoomImage } from 'src/actions/room.actions'
import {
  FieldBox,
  FieldGroup,
  H2,
} from 'src/styles/elements'

/* ========================================================================== */

const renderSuggestion = (suggestion, { query, isHighlighted }) => {
  const matches = match(suggestion.name, query)
  const parts = parse(suggestion.name, matches)

  return (
    <MenuItem>
      {/* <div> */}
      {parts.map((part, index) =>
        part.highlight ? (
          <span key={String(index)} style={{ textDecoration: 'underline' }}>
            {part.text}
          </span>
        ) : (
          <strong key={String(index)}>{part.text}</strong>
        )
      )}
      {/* </div> */}
    </MenuItem>
  )
}

const getSuggestionValue = suggestion => suggestion.name

const renderInputComponent = inputProps => {
  const { inputRef = () => {}, ref, ...other } = inputProps

  return (
    <TextField
      id="search"
      inputprops={{
        inputRef: node => {
          ref(node)
          inputRef(node)
        },
      }}
      {...other}
    />
  )
}
/* ========================================================================== */
/* SEARCH AUDIO ASSET CONTAINER */
/* ========================================================================== */
class SearchAudioAssetContainer extends Component {
  state = {
    title: '',
    url: '',
    searchTextFieldValue: '',
    suggestions: [],
    assets: [],
    assetId: '',
    mediaId: '',
  }

  onChangeSearchTextField = (event, { newValue }) => {
    this.setState({
      searchTextFieldValue: newValue,
    })
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    httpHintAsync(`${API}/hinting/title?q=${value}`, this.hintCallback)
  }

  hintCallback = responseText => {
    const response = JSON.parse(responseText)
    const hints = map(response.data, asset => ({ name: asset.title }))
    this.setState({
      suggestions: hints,
    })
  }

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    })
  }

  handleSearchAssets = () => {
    console.log('/nSEARCH ASSETS')
    const query = `${API}/search?q=${
      this.state.searchTextFieldValue
    }&type=image&user=${
      this.props.ownerId
    }&sort=title&limit=1000`

    httpGetAsync(query, this.searchAssetCallback)

    this.setState({
      ...this.state,
      suggestions: [],
      searchTextFieldValue: '',
    })
  }

  searchAssetCallback = responseText => {
    const response = JSON.parse(responseText)
    // console.log('Assets')
    // console.log(response)
    this.setState({
      ...this.state,
      assets: response.data.result,
    })
  }

  handleClickSearchResult = id => {
    const asset = this.state.assets.find(ast => ast._id === id)

    const media = asset.mediaContent[0]
    const assetId = asset._id
    const mediaId = media._id
    const imageUrl = `${API}/assets/${assetId}/media/${mediaId}`
    // console.log('Image Url')
    // console.log(imageUrl)
    this.setState({
      ...this.state,
      assetId,
      mediaId,
    })
    httpGetAsync(imageUrl, this.getImageAssetCallback, null, null, 'blob')
  }

  getImageAssetCallback = response => {
    const reader = new FileReader()
    reader.readAsDataURL(response)

    reader.onload = () => {
      this.props.onRoomImageChange({
        assetId: this.state.assetId,
        mediaId: this.state.mediaId,
        raw: reader.result,
      })

      this.setState({
        ...this.state,
        assets: [],
        assetId: '',
        mediaId: '',
      })
    }
  }

  resetImage = () => {
    this.props.onRoomImageChange({
      assetId: '',
      mediaId: '',
      raw: '',
    })
  }

  /* ------------------------------------------------------------------------ */
  render() {
    const searchResults = this.state.assets.map(asset => {
      if (asset.type === 'image') {
        return (
          <FieldBox key={asset._id}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => this.handleClickSearchResult(asset._id)}
            >
              {asset.title}
            </Button>
          </FieldBox>
        )
      }
      return <div key={asset._id} />
    })

    return (
      <Fragment>

        <H2>ROOM FLOORPLAN</H2>

        <FieldGroup>
          <FieldBox>
            <Autosuggest
              renderInputComponent={renderInputComponent}
              suggestions={this.state.suggestions}
              onSuggestionsFetchRequested={
                  this.handleSuggestionsFetchRequested
              }
              onSuggestionsClearRequested={
                  this.handleSuggestionsClearRequested
              }
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={{
                  placeholder: 'Search image asset...',
                  value: this.state.searchTextFieldValue,
                  onChange: this.onChangeSearchTextField,
                  type: 'search',
                  fullWidth: true,
              }}
              renderSuggestionsContainer={options => (
                <Paper {...options.containerProps}>{options.children}</Paper>
              )}
              focusInputOnSuggestionClick={false}
            />
          </FieldBox>
        </FieldGroup>

        <FieldBox>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={this.handleSearchAssets}
          >
            SEARCH
          </Button>
        </FieldBox>

        <FieldBox>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={this.resetImage}
          >
            RESET IMAGE
          </Button>
        </FieldBox>

        <Divider />

        {this.state.assets.length > 0 && searchResults}
      </Fragment>
    )
  }
}

SearchAudioAssetContainer.propTypes = {
  ownerId: PropTypes.string.isRequired,
  sources: PropTypes.object.isRequired,
  onRoomImageChange: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  ownerId: state.exhibition.ownerId,
  sources: state.sources.sources,
})

const mapDispatchToProps = dispatch => ({
  onRoomImageChange: image => dispatch(setRoomImage(image)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchAudioAssetContainer)
