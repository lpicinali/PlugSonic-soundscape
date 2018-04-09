import { combineReducers } from 'redux'

import controlsReducer from 'src/reducers/controls.reducer.js'
import targetReducer from 'src/reducers/target.reducer.js'
import listenerReducer from 'src/reducers/listener.reducer.js'
import roomReducer from 'src/reducers/room.reducer.js'

export default combineReducers({
  controls: controlsReducer,
  target: targetReducer,
  listener: listenerReducer,
  room: roomReducer,
})
