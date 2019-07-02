/* global parseInt */
import React, { Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { values } from 'lodash'
import { MenuItem } from '@material-ui/core'

import {
  setHrtfFilename,
  setHighPerformanceMode,
  setHighQualityMode,
} from 'src/actions/listener.actions.js'
import { FieldGroup, FullWidthSelect, H3 } from 'src/styles/elements.js'
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

    console.log('handleChange', { key, newValue })

    onChange(getHrtfFilename(newHrtf.fn, newHrtf.len))

    this.props.spatializationMode === SpatializationMode.HighQuality
      ? this.props.onSetHighQualityMode()
      : this.props.onSetHighPerformanceMode()
  }

  render() {
    const { value } = this.props

    const { fn, len } = getHrtfFromFilename(value)

    return (
      <Fragment>
        <FieldGroup>
          <H3>HRTF function</H3>
          <FullWidthSelect
            value={fn}
            onChange={evt => this.handleChange('fn', evt.target.value)}
          >
            {hrtfFunctions.map(hrtfFunction => (
              <MenuItem key={hrtfFunction} value={hrtfFunction}>
                {hrtfFunction}
              </MenuItem>
            ))}
          </FullWidthSelect>
        </FieldGroup>

        <FieldGroup>
          <H3>HRTF sample length</H3>
          <FullWidthSelect
            value={len}
            onChange={evt => this.handleChange('len', evt.target.value)}
          >
            {hrtfLengths.map(hrtfLength => (
              <MenuItem key={hrtfLength} value={hrtfLength}>
                {`${hrtfLength} samples`}
              </MenuItem>
            ))}
          </FullWidthSelect>
        </FieldGroup>
      </Fragment>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HrtfSelect)
