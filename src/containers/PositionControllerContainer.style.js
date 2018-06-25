
import styled from 'styled-components'
import Button from 'src/components/Button.js'
import { GRAY } from 'src/styles/colors.js'

export const NoSelectedSourcePlaceholder = styled.p`
  color: ${GRAY};
  font-size: 12px;
`

export const SourceEditingWrapper = styled.div`
  display: flex;
`

export const SourceReachRadiusField = styled.div`
  flex-grow: 1;
`

export const SourceReachFadeDurationField = styled.div`
  width: 30%;
  padding: 0 16px;
`

export const SourceEditingDoneButton = styled(Button)`
  margin-top: 8px;
`
