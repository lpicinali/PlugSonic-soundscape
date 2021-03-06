import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { H3 } from 'src/styles/elements.js'
import { circumferenceToRadius, radiusToCircumference } from 'src/utils.js'

import Slider from '@material-ui/lab/Slider'
import { setHeadRadius } from 'src/actions/listener.actions'

const Container = styled.div`
  padding-bottom: 12px;
`

/* ========================================================================== */
/* HEAD CIRCUMFERENCE SLIDER */
/* ========================================================================== */
class HeadCircumferenceSlider extends PureComponent {
  handleChange = (event, value) => {
    event.preventDefault()
    this.props.onChangeHeadRadius(circumferenceToRadius(value))
  }

  render() {
    return (
      <Container>
        <H3>
          {`HEAD CIRCUMFERENCE: ${Math.round(
            100 * radiusToCircumference(this.props.headRadius)
          )} cm`}
        </H3>
        <Slider
          value={radiusToCircumference(this.props.headRadius)}
          min={0.4}
          max={0.7}
          step={0.005}
          defaultValue={0.55}
          onChange={this.handleChange}
        />
      </Container>
    )
  }
}

HeadCircumferenceSlider.propTypes = {
  headRadius: PropTypes.number.isRequired,
  onChangeHeadRadius: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  headRadius: state.listener.headRadius,
})

const mapDispatchToProps = dispatch => ({
  onChangeHeadRadius: radius => dispatch(setHeadRadius(radius)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeadCircumferenceSlider)
