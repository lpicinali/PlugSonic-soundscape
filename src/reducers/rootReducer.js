import { combineReducers } from 'redux'

// import alertsReducer from 'src/reducers/alerts.reducer'
import controlsReducer from 'src/reducers/controls.reducer'
// import targetReducer from 'src/reducers/target.reducer'
import listenerReducer from 'src/reducers/listener.reducer'
import roomReducer from 'src/reducers/room.reducer'

export default combineReducers({
  // alerts: alertsReducer,
  controls: controlsReducer,
  // target: targetReducer,
  listener: listenerReducer,
  room: roomReducer,
})
