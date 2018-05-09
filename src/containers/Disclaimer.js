import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setDisclaimerRead } from 'src/actions/alerts.actions.js'
import Button from 'src/components/Button.js'
import { H3, ModuleBox, P } from 'src/styles/elements.js'
import { GutteredElement } from 'src/styles/grid.js'

/**
 * Disclaimer
 */
class Disclaimer extends PureComponent {
  static propTypes = {
    isRead: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  render() {
    const { isRead, onClose } = this.props

    if (isRead === true) {
      return null
    }

    return (
      <GutteredElement>
        <ModuleBox>
          <H3 style={{ textAlign: `center` }}>Disclaimer</H3>
          <div style={{ width: `100%`, textAlign: `center` }}>
            <P style={{ width: `60%`, display: `inline-block` }}>
              This application might result in very loud audio levels,
              which can cause damage to your hearing, especially if you are wearing headphones.
              Please ensure you take caution and keep your headphones volume low.
            </P>
          </div>
          <div style={{ textAlign: `center` }}>
            <Button align='center' onClick={onClose}>
              Understood, don’t show me this again.
            </Button>
          </div>
        </ModuleBox>
      </GutteredElement>
    )
  }
}

export default connect(null, dispatch => ({
  onClose: () => dispatch(setDisclaimerRead(true)),
}))(Disclaimer)
