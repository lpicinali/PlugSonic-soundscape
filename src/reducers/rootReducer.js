import { combineReducers } from 'redux'

import controlsReducer from 'src/reducers/controls.reducer.js'
import targetReducer from 'src/reducers/target.reducer.js'

export default combineReducers({
  controls: controlsReducer,
  target: targetReducer,
})
