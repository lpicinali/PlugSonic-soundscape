export const ActionType = {

  // ALERTS
  SET_DISCLAIMER_READ: 'SET_DISCLAIMER_READ',
  SET_PRESET_INFO_DISMISSED: 'SET_PRESET_INFO_DISMISSED',

  // CONTROLS
  SET_PLAYBACK_STATE: 'SET_PLAYBACK_STATE',
  SHOW_SETTINGS_DRAWER: 'SHOW_SETTINGS_DRAWER',
  HIDE_SETTINGS_DRAWER: 'HIDE_SETTINGS_DRAWER',

  // LISTENER
  SET_LISTENER_POSITION: 'SET_LISTENER_POSITION',
  SET_HIGH_PERFORMANCE_MODE: 'SET_HIGH_PERFORMANCE_MODE',
  SET_HIGH_QUALITY_MODE: 'SET_HIGH_QUALITY_MODE',
  SET_HEAD_RADIUS: 'SET_HEAD_RADIUS',
  // SET_DIRECTIONALITY_ENABLED: 'SET_DIRECTIONALITY_ENABLED',
  // SET_DIRECTIONALITY_VALUE: 'SET_DIRECTIONALITY_VALUE',
  IMPORT_LISTENER: 'IMPORT_LISTENER',

  // ROOM
  SET_ROOM_SHAPE: 'SET_ROOM_SHAPE',
  SET_ROOM_SIZE: 'SET_ROOM_SIZE',
  SET_ROOM_IMAGE: 'SET_ROOM_IMAGE',
  IMPORT_ROOM: 'IMPORT_ROOM',

  // PANELS
  HIDE_LEFT_PANEL: 'HIDE_LEFT_PANEL',
  SHOW_LEFT_PANEL: 'SHOW_LEFT_PANEL',

  // SOURCE
  SOURCE_ONOFF: 'SOURCE_ONOFF',
  SET_EDITING_SOURCE: 'SET_EDITING_SOURCE',
  SET_SOURCE_POSITION: 'SET_SOURCE_POSITION',
  SET_SOURCE_REACH: 'SET_SOURCE_REACH',
  SET_SOURCE_VOLUME: 'SET_SOURCE_VOLUME',
  SET_MASTER_VOLUME: 'SET_MASTER_VOLUME',
  ADD_SOURCE_LOCAL: 'ADD_SOURCE_LOCAL',
  ADD_SOURCE_REMOTE: 'ADD_SOURCE_REMOTE',
  DELETE_SOURCES: 'DELETE_SOURCES',
  IMPORT_SOURCES: 'IMPORT_SOURCES',
}

export const Ear = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
}

export const PlaybackState = {
  PAUSE: 'PAUSE',
  PLAY: 'PLAY',
  STOP: 'STOP',
}

export const RoomShape = {
  ROUND: 'ROUND',
  RECTANGULAR: 'RECTANGULAR',
}

export const SpatializationMode = {
  HighQuality: 'HighQuality',
  HighPerformance: 'HighPerformance'
}
