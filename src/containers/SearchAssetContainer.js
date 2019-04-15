import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Autosuggest from 'react-autosuggest'
import styled from 'styled-components'
import { map } from 'lodash'

import TextField from 'material-ui/TextField'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper'
import Divider from 'material-ui/Divider'
import DropDownMenu from 'material-ui/DropDownMenu'

import { SourceOrigin } from 'src/constants.js'
import { API, httpHintAsync, httpGetAsync } from 'src/pluggy.js'
import { addSource } from 'src/actions/sources.actions.js'
import * as colors from 'src/styles/colors.js'

/* ========================================================================== */
export const textFieldStyle = {
  marginLeft: `20px`,
  width: `85%`,
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
  marginTop: '10px',
  marginBottom: '10px',
  textColor: `${colors.WHITE}`,
}
const DividerStyle = {
  marginTop: '10px',
  marginBottom: '10px',
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
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
      style={textFieldStyle}
      underlineFocusStyle={underlineFocusStyle}
      underlineStyle={underlineStyle}
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
    orderBy: '',
    myAssets: false,
  }

  onChangeSearchTextField = (event, { newValue }) => {
    // console.log('\nON CHANGE SEARCH')
    // console.log(`state.searchTextFieldValue = ${newValue}`)
    this.setState({
      searchTextFieldValue: newValue,
    })
  }

  onSuggestionsFetchRequested = ({ value }) => {
    // console.log('\nON SUGGESTIONS FETCH REQUESTED')
    // console.log(`value = ${value}`)
    httpHintAsync(`${API}/hinting/title?q=${value}`, this.hintCallback)
  }

  onSuggestionsClearRequested = () => {
    // console.log('\nON SUGGESTIONS CLEAR REQUESTED')
    // console.log(`state.suggestions = []`)
    this.setState({
      suggestions: [],
    })
  }

  onClickListItem = id => {
    const asset = this.state.assets.find(ast => ast._id === id)

    const sourceTitle = asset.title
    const media = asset.mediaContent[0]
    const sourceFilename = media.filename
    const mediaId = media._id
    const sourceUrl = `${API}/assets/${asset._id}/media/${mediaId}`

    // console.log('Adding...')
    // console.log(sourceTitle)
    // console.log(sourceFilename)
    // console.log(sourceUrl)

    this.props.onAddSource(sourceTitle, sourceFilename, sourceUrl, [])

    this.setState({
      ...this.state,
      assets: [],
    })
  }

  onClickSearchResult = id => {
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
    // console.log(`\nHINT CALLBACK`)
    const response = JSON.parse(responseText)
    // console.log(`response`)
    // console.log(response)
    const hints = map(response.data, asset => ({ name: asset.title }))
    // console.log(`HINTING suggests`)
    // console.log(hints)
    this.setState({
      suggestions: hints,
    })
  }

  searchAssets = () => {
    // console.log('/nSEARCH ASSETS')
    httpGetAsync(
      // `${API}/search?q=${this.state.searchTextFieldValue}`,
      `${API}/search?q=${this.state.searchTextFieldValue}&type=audio&limit=1000`,
      this.searchAssetCallback
    )

    this.setState({
      ...this.state,
      suggestions: [],
      searchTextFieldValue: '',
    })
  }

  searchAssetCallback = responseText => {
    // console.log(`\nGET ASSET CALLBACK`)
    const response = JSON.parse(responseText)
    // console.log(`response`)
    // console.log(response)
    this.setState({
      ...this.state,
      assets: response.data.result,
    })
    // console.log('\nthis.state.assets')
    // console.log(this.state.assets)
  }

  /* ------------------------------------------------------------------------ */
  render() {
    const searchResults = this.state.assets.map(asset => {
      if (asset.type === 'audio') {
        return (
          <FlatButton
            key={asset._id}
            label={asset.title}
            onClick={() => {
              this.onClickSearchResult(asset._id)
            }}
            style={FlatButtonStyle}
            backgroundColor={`${colors.BLACK}`}
            secondary
          />
        )
      }
      return <div key={asset._id} />
    })

    return (
      <Container>
        <Autosuggest
          renderInputComponent={renderInputComponent}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={{
            placeholder: 'Search asset...',
            value: this.state.searchTextFieldValue,
            onChange: this.onChangeSearchTextField,
            type: 'search',
          }}
          renderSuggestionsContainer={options => (
            <Paper {...options.containerProps}>{options.children}</Paper>
          )}
          focusInputOnSuggestionClick={false}
        />

        {/* <DropDownMenu
          style={DropDownMenuStyle}
          iconStyle={IconStyle}
          underlineStyle={UnderlineStyle}
          value={this.props.roomShape}
          onChange={this.handleChange}>
          <MenuItem value={!this.state.myAssets} primaryText="All Pluggy" />
          <MenuItem value={this.state.myAssets} primaryText="My Assets" />
        </DropDownMenu> */}

        <FlatButton
          style={FlatButtonStyle}
          backgroundColor={`${colors.BLACK}`}
          onClick={this.searchAssets}
          secondary
        >
          SEARCH
        </FlatButton>

        <Divider style={DividerStyle} />

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
