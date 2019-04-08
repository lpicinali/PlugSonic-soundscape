/* global parseInt */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { values } from 'lodash'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'

import { setHrtfFilename } from 'src/actions/listener.actions.js'
import * as colors from 'src/styles/colors.js'
import { H3 } from 'src/styles/elements'
import { setHighPerformanceMode, setHighQualityMode } from 'src/actions/listener.actions'
import { SpatializationMode } from 'src/constants'


const hrtfFunctions = [
  'IRC1008',
  'IRC1013',
  'IRC1022',
  'IRC1031',
  'IRC1032',
  'IRC1048',
  'IRC1053',
]

const hrtfLengths = [128, 256, 512]

function getHrtfFilename(fn, len) {
  return `3DTI_HRTF_${fn}_${len}s_44100Hz.3dti-hrtf`
}

function getHrtfFromFilename(url) {
  const [, , fn, len] = url.split('_')
  console.log('getHrtfFilename', { url, fn, len })
  return {
    fn,
    len: parseInt(len.replace(/s$/, ''), 10),
  }
}

const Container = styled.div`
  width: 85%
  margin: auto;
`

const DropDownMenuStyle = {
  width: '100%',
}

const IconStyle = {
  fill: colors.BLACK,
}

const UnderlineStyle = {
  borderTop: `solid 1px ${colors.BLACK}`,
}

/**
 * Hrtf Select
 */
class HrtfSelect extends PureComponent {

  handleChange = (key, newValue) => {
    const { value, onChange } = this.props

    const currentHrtf = getHrtfFromFilename(value)
    const newHrtf = {
      ...currentHrtf,
      [key]: newValue,
    }

    onChange(getHrtfFilename(newHrtf.fn, newHrtf.len))

    this.props.spatializationMode === SpatializationMode.HighQuality ?
      this.props.onSetHighQualityMode()
        :
      this.props.onSetHighPerformanceMode()
  }

  render() {
    const { value, onChange } = this.props

    const { fn, len } = getHrtfFromFilename(value)

    return (
      <Container>
        <H3>HRTF function</H3>
        <DropDownMenu
          style={DropDownMenuStyle}
          iconStyle={IconStyle}
          underlineStyle={UnderlineStyle}
          value={fn}
          onChange={(evt, index, value) => this.handleChange('fn', value)}
        >
          {hrtfFunctions.map(hrtfFunction => (
            <MenuItem
              key={hrtfFunction}
              value={hrtfFunction}
              primaryText={hrtfFunction}
            />
          ))}
        </DropDownMenu>

        <H3>HRTF sample length</H3>
        <DropDownMenu
          style={DropDownMenuStyle}
          iconStyle={IconStyle}
          underlineStyle={UnderlineStyle}
          value={len}
          onChange={(evt, index, value) => this.handleChange('len', value)}
        >
          {hrtfLengths.map(hrtfLength => (
            <MenuItem
              key={hrtfLength}
              value={hrtfLength}
              primaryText={`${hrtfLength} samples`}
            />
          ))}
        </DropDownMenu>
      </Container>
    )
  }
}

HrtfSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  spatializationMode: PropTypes.oneOf(values(SpatializationMode)).isRequired,
  onSetHighPerformanceMode: PropTypes.func.isRequired,
  onSetHighQualityMode: PropTypes.func.isRequired,
}

HrtfSelect.defaultProps = {
  spatializationMode: SpatializationMode.HighQuality,
}

const mapStateToProps = state => ({
  value: state.listener.hrtfFilename,
  spatializationMode: state.listener.spatializationMode,
})

const mapDispatchToProps = dispatch => ({
  onChange: filename => dispatch(setHrtfFilename(filename)),
  onSetHighPerformanceMode: () => dispatch(setHighPerformanceMode()),
  onSetHighQualityMode: () => dispatch(setHighQualityMode()),
})

export default connect(mapStateToProps,mapDispatchToProps)(HrtfSelect)
