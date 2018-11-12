/* eslint import/prefer-default-export: 0 */
import styled from 'styled-components'

import { MAX_WIDTH } from 'src/styles/layout.js'

export const GridContainer = styled.div`
  max-width: ${MAX_WIDTH}px;
  margin: 0 auto;
`

export const GutteredElement = styled.div`
  padding-right: 12px;
  padding-left: 12px;
`
