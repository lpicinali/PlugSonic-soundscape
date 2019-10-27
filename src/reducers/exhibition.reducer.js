/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

const initialState = {
  coverLegal: {},
  description: '',
  id: '',
  ownerId: '',
  tags: [],
  title: '',
  isPublished: false,
}

export default function(state = initialState, { type, payload }) {
  if (type === ActionType.IMPORT_EXHIBITION) {
    return {
      ...state,
      description: payload.description,
      id: payload.id,
      ownerId: payload.ownerId,
      tags: payload.tags,
      title: payload.title,
      isPublished: payload.isPublished,
    }
  }

  if (type === ActionType.SET_COVERLEGAL) {
    return { ...state, coverLegal: payload.coverLegal }
  }

  if (type === ActionType.SET_DESCRIPTION) {
    return { ...state, description: payload.description }
  }

  if (type === ActionType.SET_EXHIBITION_ID) {
    return { ...state, id: payload.id }
  }

  if (type === ActionType.SET_OWNER_ID) {
    return { ...state, ownerId: payload.id }
  }

  if (type === ActionType.SET_TAGS) {
    return { ...state, tags: payload.tags }
  }

  if (type === ActionType.SET_TITLE) {
    return { ...state, title: payload.title }
  }

  if (type === ActionType.SET_PUBLISHED) {
    return { ...state, isPublished: payload.isPublished }
  }

  return state
}
