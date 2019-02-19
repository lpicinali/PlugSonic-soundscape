/* eslint no-undef: 0 */
import PropTypes from 'prop-types'
// import { values } from 'lodash'

// import { HearingLossGrade } from 'src/constants.js'

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
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
})

export const position = PropTypes.shape({
  azimuth: PropTypes.number.isRequired,
  distance: PropTypes.number.isRequired,
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
  filename: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  platform_id: PropTypes.string,
  raw: PropTypes.arrayOf(PropTypes.number).isRequired,
  hidden: PropTypes.bool.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
  }).isRequired,
  reach: PropTypes.shape({
    radius: PropTypes.number.isRequired,
    fadeDuration: PropTypes.number.isRequired,
  }),
  selected: PropTypes.bool.isRequired,
  spatialised: PropTypes.bool.isRequired,
  url: PropTypes.string,
  volume: PropTypes.number.isRequired,
})
