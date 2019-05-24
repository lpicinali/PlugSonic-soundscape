import React from 'react'
import styled, { css } from 'styled-components'
import { FormControl, FormControlLabel, Input, Select, Switch, withStyles } from '@material-ui/core'

import * as colors from 'src/styles/colors.js'

export const H2 = styled.h2`
  color: ${colors.BLACK};
  font-size: 16px;
  margin: 10px 0px;
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
  text-align: center;
  margin: 4px 0px 4px 0px;
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

export const Label = styled.label`
  margin-bottom: 8px;
`

export const PanelContents = styled.div`
  padding: 24px;
`

export const FullWidthSelect = props => <Select {...props} input={<Input fullWidth />} />

export const FieldGroup = styled.div`
  margin-bottom: 24px;

  ${props => props.disabled && css`
    opacity: 0.4;
    pointer-events: none;
  `}
`

export const FieldBox = styled.div`
  margin: 16px 0;
`

export const SliderBox = styled(FieldBox)`
  padding-bottom: 12px;
`

export const SwitchControlLabel = withStyles({
  root: {
    display: 'flex',
    margin: 0,
    width: '100%',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
  }
})(FormControlLabel)

export const SwitchBox = styled.div`
  display: flex;
  justify-content: space-between;
`

export const PaddedFormControl = withStyles({
  root: {
    margin: '16px 0',
  },
})(FormControl)
