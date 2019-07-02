/* ------------------- NOTES -------------------- */ /*

*/ /* ---------------------------------------------- */

import { ActionType } from 'src/constants.js'

export const importExhibition = (
  description,
  id,
  ownerId,
  tags,
  title,
  isPublished
) => ({
  type: ActionType.IMPORT_EXHIBITION,
  payload: {
    description,
    id,
    ownerId,
    tags,
    title,
    isPublished,
  },
})

export const setDescription = description => ({
  type: ActionType.SET_DESCRIPTION,
  payload: { description },
})

export const setExhibitionId = id => ({
  type: ActionType.SET_EXHIBITION_ID,
  payload: { id },
})

export const setOwnerId = id => ({
  type: ActionType.SET_OWNER_ID,
  payload: { id },
})

export const setTags = tags => ({
  type: ActionType.SET_TAGS,
  payload: { tags },
})

export const setTitle = title => ({
  type: ActionType.SET_TITLE,
  payload: { title },
})

export const setPublished = isPublished => ({
  type: ActionType.SET_PUBLISHED,
  payload: { isPublished },
})
