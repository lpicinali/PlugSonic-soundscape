import styled from 'styled-components'

import { BLACK, BLUE, WHITE_SMOKE, GRAY } from 'src/styles/colors.js'

export const H2 = styled.h2`
  margin: 0 0 12px;
  padding-left: 20%;
  font-size: 20px;
  color: ${BLUE};
`

export const H3 = styled.h3`
  margin: 0px 0 8px;
  color: gray;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
`

export const H4 = styled.h4`
  color: ${GRAY};
  font-size: 12px;
`

export const P = styled.p`
  font-size: 16px;
  color: ${BLACK};
`

export const ModuleBox = styled.div`
  padding: 16px 24px 24px;
  background: ${WHITE_SMOKE};
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`
