import { combineReducers } from 'redux'

// import alertsReducer from 'src/reducers/alerts.reducer'
import controlsReducer from 'src/reducers/controls.reducer'
import exhibitionReducer from 'src/reducers/exhibition.reducer'
// import dialogsReducer from 'src/reducers/dialogs.reducer'
import listenerReducer from 'src/reducers/listener.reducer'
import navigationReducer from 'src/reducers/navigation.reducer'
import roomReducer from 'src/reducers/room.reducer'
import sourcesReducer from 'src/reducers/sources.reducer'

export default combineReducers({
  // alerts: alertsReducer,
  controls: controlsReducer,
  exhibition: exhibitionReducer,
  // dialogs: dialogsReducer,
  listener: listenerReducer,
  navigation: navigationReducer,
  room: roomReducer,
  sources: sourcesReducer,
})
