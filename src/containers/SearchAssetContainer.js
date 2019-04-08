import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Autosuggest from 'react-autosuggest'
import styled from 'styled-components'
import { map } from 'lodash'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { Button, Divider, MenuItem, Paper, Select, TextField } from '@material-ui/core'

import { SourceOrigin } from 'src/constants.js'
import {
  API,
  userId,
  httpHintAsync,
  httpGetAsync,
} from 'src/pluggy.js'
import { addSource } from 'src/actions/sources.actions.js'
import * as colors from 'src/styles/colors.js'
import {H2} from 'src/styles/elements'

/* ========================================================================== */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 24px;
`
const DropDownMenuStyle = {
  width: '100%'
}
const IconStyle = {
  fill: colors.BLACK
}
const UnderlineStyle = {
  borderTop: `solid 1px ${colors.BLACK}`,
}
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

  handleSearchDropDownChange = (event, index, value) => {
    this.setState({
      myAssets: value
    })
  }

  handleOrderByDropDownChange = (event, index, value) => {
    this.setState({
      orderBy: value
    })
  }

  /* ------------------------------------------------------------------------ */
  render() {
    const searchResults = this.state.assets.map(asset => {
      if (asset.type === 'audio') {
        return (
          <Button
            variant="contained"
            color="primary"
            key={asset._id}
            onClick={() => {
              this.handleClickSearchResult(asset._id)
            }}
          >
            {asset.title}
          </Button>
        )
      }
      return <div key={asset._id} />
    })

    return (
      <Container>
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

        <Select value={this.state.myAssets} onChange={this.handleSearchDropDownChange}>
          <MenuItem value={false}>All Pluggy</MenuItem>
          <MenuItem value>My Assets</MenuItem>
        </Select>

        <H2>ORDER BY</H2>

        <Select value={this.state.orderBy} onChange={this.handleOrderByDropDownChange}>
          <MenuItem value="trending">Trending</MenuItem>
          <MenuItem value="recent">Recent</MenuItem>
          <MenuItem value="title">Title</MenuItem>
        </Select>

        <Button variant="contained" color="primary" onClick={this.handleSearchAssets}>
          SEARCH
        </Button>

        <Divider />

        {this.state.assets.length > 0 && searchResults}
      </Container>
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
