import { combineReducers } from 'redux'

// import alertsReducer from 'src/reducers/alerts.reducer'
import controlsReducer from 'src/reducers/controls.reducer'
import sourcesReducer from 'src/reducers/sources.reducer'
import listenerReducer from 'src/reducers/listener.reducer'
import roomReducer from 'src/reducers/room.reducer'

export default combineReducers({
  // alerts: alertsReducer,
  controls: controlsReducer,
  listener: listenerReducer,
  room: roomReducer,
  sources: sourcesReducer,
})
