/* global parseInt */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { values } from 'lodash'

import { setHrtfFilename } from 'src/actions/listener.actions.js'

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
  return {
    fn,
    len: parseInt(len.replace(/s$/, ''), 10),
  }
}

/**
 * Hrtf Select
 */
class HrtfSelect extends PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  handleChange = (key, newValue) => {
    const { value, onChange } = this.props

    const currentHrtf = getHrtfFromFilename(value)
    const newHrtf = {
      ...currentHrtf,
      [key]: newValue,
    }

    onChange(getHrtfFilename(newHrtf.fn, newHrtf.len))
  }

  render() {
    const { value, onChange } = this.props

    const { fn, len } = getHrtfFromFilename(value)

    return (
      <div>
        <select
          value={fn}
          onChange={evt => this.handleChange('fn', evt.target.value)}
        >
          {hrtfFunctions.map(hrtfFunction => (
            <option key={hrtfFunction}>{hrtfFunction}</option>
          ))}
        </select>

        <select
          value={len}
          onChange={evt => this.handleChange('len', evt.target.value)}
        >
          {hrtfLengths.map(hrtfLength => (
            <option key={hrtfLength} value={hrtfLength}>
              {hrtfLength} samples
            </option>
          ))}
        </select>
      </div>
    )
  }
}

export default connect(
  state => ({
    value: state.listener.hrtfFilename,
  }),
  dispatch => ({
    onChange: filename => dispatch(setHrtfFilename(filename)),
  })
)(HrtfSelect)
