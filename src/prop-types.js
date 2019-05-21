/* eslint no-undef: 0 */
import PropTypes from 'prop-types'
// import { values } from 'lodash'

import { PlaybackTiming, ReachAction } from 'src/constants.js'

function makeRequirable(validate) {
  function checkExists(
    isRequired,
    props,
    propName,
    componentName,
    location,
    propFullName
  ) {
    if (props[propName] === null || props[propName] === undefined) {
      if (isRequired === true) {
        return new Error(
          `The ${location} \`${propFullName}\` is marked as required in \`${componentName}\`, but its value is \`${
            prop[propName]
          }\`.`
        )
      }

      return null
    }

    return validate(props, propName, componentName, location, propFullName)
  }

  const requirableValidate = checkExists.bind(null, false)
  requirableValidate.isRequired = checkExists.bind(null, true)

  return requirableValidate
}

// export const grade = PropTypes.oneOf(values(HearingLossGrade))

export const rect = PropTypes.shape({
  top: PropTypes.number.isRequired,
  bottom: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  right: PropTypes.number.isRequired,
})

export const vector3 = PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  z: PropTypes.number.isRequired,
})

export const scrollable = makeRequirable((props, propName, componentName) => {
  const { scrollLeft, scrollTop, scrollX, scrollY } = props[propName]

  if (
    (scrollLeft === undefined && scrollX === undefined) ||
    (scrollTop === undefined && scrollY === undefined)
  ) {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. ` +
        `\`${propName}\` needs to have a pair of scroll offsets, either { scrollTop, scrollLeft } or { scrollX, scrollY }. ` +
        `Current values are: \n\tscrollLeft: ${
          props[propName].scrollLeft
        } \n\tscrollTop: ${props[propName].scrollTop} \n\tscrollX: ${
          props[propName].scrollX
        } \n\tscrollY: ${props[propName].scrollY}`
    )
  }

  if (typeof props[propName].addEventListener !== 'function') {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. It is missing an addEventListener() function.`
    )
  }

  return null
})

export const source = PropTypes.shape({
  enabled: PropTypes.bool.isRequired,
  filename: PropTypes.string.isRequired,
  hidden: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  platform_asset_id: PropTypes.string,
  platform_media_id: PropTypes.string,
  raw: PropTypes.arrayOf(PropTypes.number),
  position: vector3.isRequired,
  reach: PropTypes.shape({
    action: PropTypes.oneOf(Object.values(ReachAction)),
    enabled: PropTypes.bool.isRequired,
    fadeDuration: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired,
  }),
  timings: PropTypes.shape({
    [PlaybackTiming.PLAY_AFTER]: PropTypes.string,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  spatialised: PropTypes.bool.isRequired,
  url: PropTypes.string,
  volume: PropTypes.number.isRequired,
})
