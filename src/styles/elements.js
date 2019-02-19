import styled from 'styled-components'

import * as colors from 'src/styles/colors.js'

export const H2 = styled.h2`
  color: ${colors.BLACK};
  font-size: 16px;
  margin: 10px 0px 0px 20px;
  text-transform: uppercase;
`

export const H3 = styled.h3`
  color: ${colors.BLACK};
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
`

export const H4 = styled.h4`
  color: ${colors.GRAY};
  font-size: 12px;
`

export const P = styled.p`
  color: ${colors.BLACK};
  font-size: 12px;
`

export const ModuleBox = styled.div`
  background: ${colors.WHITE_SMOKE};
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  padding: 16px 24px 24px;
`
