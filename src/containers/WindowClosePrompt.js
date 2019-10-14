import { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Dialog } from 'src/constants.js'

/**
 * Window Close Prompt
 */
class WindowClosePrompt extends PureComponent {
  static propTypes = {
    shouldPrompt: PropTypes.bool.isRequired,
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  }

  handleBeforeUnload = evt => {
    if (this.props.shouldPrompt) {
      evt.returnValue =
        'You have made changes that will be lost if you close this window. Are you sure you want to leave?'
    }
  }

  render() {
    return null
  }
}

export default connect(state => ({
  shouldPrompt: state.dialogs.dialogs[Dialog.CLOSE_PROMPT],
}))(WindowClosePrompt)
