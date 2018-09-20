import styled from 'styled-components'

import { BLACK, BLUE, WHITE_SMOKE, DARKGRAY, GRAY } from 'src/styles/colors.js'

export const H2 = styled.h2`
  color: ${BLUE};
  font-size: 20px;
  margin: 0px;
`

export const H3 = styled.h3`
  color: ${DARKGRAY};
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
`

export const H4 = styled.h4`
  color: ${GRAY};
  font-size: 12px;
`

export const P = styled.p`
  color: ${BLACK};
  font-size: 16px;
`

export const ModuleBox = styled.div`
  background: ${WHITE_SMOKE};
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  padding: 16px 24px 24px;
`
