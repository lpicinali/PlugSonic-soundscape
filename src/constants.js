export const ActionType = {
  // CONTROLS
  HIDE_ARROWS_DRAWER: 'HIDE_ARROWS_DRAWER',
  HIDE_SETTINGS_DRAWER: 'HIDE_SETTINGS_DRAWER',
  SET_PLAYBACK_STATE: 'SET_PLAYBACK_STATE',
  SHOW_ARROWS_DRAWER: 'SHOW_ARROWS_DRAWER',
  SHOW_SETTINGS_DRAWER: 'SHOW_SETTINGS_DRAWER',
  // SET_MASTER_VOLUME: 'SET_MASTER_VOLUME',

  // DIALOGS
  SET_SHOULD_SHOW_DIALOG: 'SET_SHOULD_SHOW_DIALOG',

  // EXHIBITION
  IMPORT_EXHIBITION: 'IMPORT_EXHIBITION',
  SET_COVERLEGAL: 'SET_COVERLEGAL',
  SET_DESCRIPTION: 'SET_DESCRIPTION',
  SET_EXHIBITION_ID: 'SET_EXHIBITION_ID',
  SET_OWNER_ID: 'SET_OWNER_ID',
  SET_TAGS: 'SET_TAGS',
  SET_TITLE: 'SET_TITLE',
  SET_PUBLISHED: 'SET_PUBLISHED',

  // LISTENER
  IMPORT_LISTENER: 'IMPORT_LISTENER',
  SET_HEAD_RADIUS: 'SET_HEAD_RADIUS',
  SET_HIGH_PERFORMANCE_MODE: 'SET_HIGH_PERFORMANCE_MODE',
  SET_HIGH_QUALITY_MODE: 'SET_HIGH_QUALITY_MODE',
  SET_HRTF_FILENAME: 'SET_HRTF_FILENAME',
  SET_LISTENER_POSITION: 'SET_LISTENER_POSITION',
  // SET_DIRECTIONALITY_ENABLED: 'SET_DIRECTIONALITY_ENABLED',
  // SET_DIRECTIONALITY_VALUE: 'SET_DIRECTIONALITY_VALUE',

  // ROOM
  IMPORT_ROOM: 'IMPORT_ROOM',
  SET_ROOM_IMAGE: 'SET_ROOM_IMAGE',
  SET_ROOM_SHAPE: 'SET_ROOM_SHAPE',
  SET_ROOM_SIZE: 'SET_ROOM_SIZE',

  // PANELS
  HIDE_LEFT_PANEL: 'HIDE_LEFT_PANEL',
  SHOW_LEFT_PANEL: 'SHOW_LEFT_PANEL',

  // SOURCE
  SET_IS_FETCHING_SOURCE: 'SET_IS_FETCHING_SOURCE',
  ADD_SOURCE: 'ADD_SOURCE',
  DELETE_SOURCES: 'DELETE_SOURCES',
  IMPORT_SOURCES: 'IMPORT_SOURCES',
  SET_SOURCE_SELECTED: 'SET_SOURCE_SELECTED',
  SET_SOURCE_HIDDEN: 'SET_SOURCE_HIDDEN',
  SET_SOURCE_LOOP: 'SET_SOURCE_LOOP',
  SET_SOURCE_POSITIONING: 'SET_SOURCE_POSITIONING',
  SET_SOURCE_POSITION: 'SET_SOURCE_POSITION',
  SET_SOURCE_RELATIVE_POSITION: 'SET_SOURCE_RELATIVE_POSITION',
  SET_SOURCE_REACH_ACTION: 'SET_SOURCE_REACH_ACTION',
  SET_SOURCE_REACH_ENABLED: 'SET_SOURCE_REACH_ENABLED',
  SET_SOURCE_REACH_FADE_DURATION: 'SET_SOURCE_REACH_FADE_DURATION',
  SET_SOURCE_REACH_RADIUS: 'SET_SOURCE_REACH_RADIUS',
  SET_SOURCE_SPATIALISED: 'SET_SOURCE_SPATIALISED',
  SET_SOURCE_TIMING: 'SET_SOURCE_TIMING',
  SET_SOURCE_VOLUME: 'SET_SOURCE_VOLUME',
  SOURCE_ONOFF: 'SOURCE_ONOFF',
  FOCUS_SOURCE_PANEL_ITEM: 'FOCUS_SOURCE_PANEL_ITEM',

  // SOURCE GAMEPLAY STATE
  SET_SOURCE_IS_PLAYING: 'SET_SOURCE_IS_PLAYING',
  SET_SOURCE_IS_WITHIN_REACH: 'SET_SOURCE_IS_WITHIN_REACH',
  SET_SOURCE_TIMING_STATUS: 'SET_SOURCE_TIMING_STATUS',

  // NAVIGATION
  SELECT_TAB: 'SELECT_TAB',
  NAVIGATE_TO_SOURCE_IN_MENU: 'NAVIGATE_TO_SOURCE_IN_MENU',
}

export const DEFAULT_Z_POSITION = 1.7
export const DEFAULT_RELATIVE_AZIMUTH = 0
export const DEFAULT_RELATIVE_DISTANCE = 3

export const Dialog = {}

export const Ear = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
}

export const PlaybackState = {
  PAUSE: 'PAUSE',
  PLAY: 'PLAY',
  RECORD: 'RECORD',
  STOP: 'STOP',
}

export const PlaybackTiming = {
  PLAY_AFTER: 'playAfter',
}

export const ReachAction = {
  TOGGLE_PLAYBACK: 'TOGGLE_PLAYBACK',
  TOGGLE_VOLUME: 'TOGGLE_VOLUME',
}

export const RoomShape = {
  RECTANGULAR: 'RECTANGULAR',
  ROUND: 'ROUND',
}

export const SourceOrigin = {
  LOCAL: 'LOCAL',
  REMOTE: 'REMOTE',
}

export const SourcePositioning = {
  ABSOLUTE: 'ABSOLUTE',
  RELATIVE: 'RELATIVE',
}

export const SpatializationMode = {
  HighQuality: 'HIGH_QUALITY',
  HighPerformance: 'PERFORMANCE',
}

export const TimingStatus = {
  ADMITTED: 'ADMITTED',
  CUED: 'CUED',
  INDEPENDENT: 'INDEPENDENT',
}
