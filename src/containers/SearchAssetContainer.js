import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Autosuggest from 'react-autosuggest'
import { map } from 'lodash'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { Button, Divider, MenuItem, Paper, TextField } from '@material-ui/core'

import { SourceOrigin } from 'src/constants.js'
import {
  API,
  userId,
  httpHintAsync,
  httpGetAsync,
} from 'src/pluggy.js'
import { addSource } from 'src/actions/sources.actions.js'
import { FieldBox, FieldGroup, FullWidthSelect, H2, PanelContents } from 'src/styles/elements'

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
/* SEARCH ASSET CONTAINER */
/* ========================================================================== */
class SearchAssetContainer extends Component {
  state = {
    title: '',
    url: '',
    searchTextFieldValue: '',
    suggestions: [],
    assets: [],
    orderBy: 'title',
    myAssets: false,
  }

  onChangeSearchTextField = (event, { newValue }) => {
    this.setState({
      searchTextFieldValue: newValue,
    })
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    httpHintAsync(`${API}/hinting/title?q=${value}`, this.hintCallback)
  }

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    })
  }

  handleClickSearchResult = id => {
    const asset = this.state.assets.find(ast => ast._id === id)

    const media = asset.mediaContent[0]
    const sourceFilename = media.filename
    const sourceName = asset.title
    const assetId = asset._id
    const mediaId = media._id
    const sourceUrl = `${API}/assets/${assetId}/media/${mediaId}`

    console.log('Adding...')
    console.log(sourceName)
    console.log(sourceFilename)
    console.log(sourceUrl)

    this.props.onAddSource(
      sourceFilename,
      sourceName,
      sourceUrl,
      assetId,
      mediaId
    )

    this.setState({
      ...this.state,
      assets: [],
    })
  }

  hintCallback = responseText => {
    const response = JSON.parse(responseText)
    const hints = map(response.data, asset => ({ name: asset.title }))
    this.setState({
      suggestions: hints,
    })
  }

  handleSearchAssets = () => {
    console.log('/nSEARCH ASSETS')
    let query = `${API}/search?q=${this.state.searchTextFieldValue}&type=audio&limit=1000`

    if (this.state.myAssets) {
      query = `${query}&user=${userId}`
    }

    query=`${query}&sort=${this.state.orderBy}`

    console.log(query)

    httpGetAsync(
      query,
      this.searchAssetCallback
    )

    this.setState({
      ...this.state,
      suggestions: [],
      searchTextFieldValue: '',
    })
  }

  searchAssetCallback = responseText => {
    const response = JSON.parse(responseText)
    this.setState({
      ...this.state,
      assets: response.data.result,
    })
  }

  handleSearchDropDownChange = (event) => {
    this.setState({
      myAssets: event.target.value
    })
  }

  handleOrderByDropDownChange = (event) => {
    this.setState({
      orderBy: event.target.value
    })
  }

  /* ------------------------------------------------------------------------ */
  render() {
    const searchResults = this.state.assets.map(asset => {
      if (asset.type === 'audio') {
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
        <PanelContents>
          <FieldGroup>
            <FieldBox>
              <Autosuggest
                renderInputComponent={renderInputComponent}
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={{
                  placeholder: 'Search asset...',
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

            <FieldBox>
              <FullWidthSelect value={this.state.myAssets} onChange={this.handleSearchDropDownChange}>
                <MenuItem value={false}>All Pluggy</MenuItem>
                <MenuItem value>My Assets</MenuItem>
              </FullWidthSelect>
            </FieldBox>
          </FieldGroup>

          <H2>ORDER BY</H2>

          <FieldBox>
            <FullWidthSelect value={this.state.orderBy} onChange={this.handleOrderByDropDownChange}>
              <MenuItem value="trending">Trending</MenuItem>
              <MenuItem value="recent">Recent</MenuItem>
              <MenuItem value="title">Title</MenuItem>
            </FullWidthSelect>
          </FieldBox>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={this.handleSearchAssets}
          >
            SEARCH
          </Button>
        </PanelContents>

        <Divider />

        <PanelContents>
          {this.state.assets.length > 0 && searchResults}
        </PanelContents>
      </Fragment>
    )
  }
}

SearchAssetContainer.propTypes = {
  sources: PropTypes.object.isRequired,
  onAddSource: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  sources: state.sources.sources,
})

const mapDispatchToProps = dispatch => ({
  onAddSource: (filename, name, url, assetId, mediaId) =>
    dispatch(
      addSource({
        filename,
        name,
        url,
        assetId,
        mediaId,
        origin: SourceOrigin.REMOTE,
      })
    ),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchAssetContainer)
