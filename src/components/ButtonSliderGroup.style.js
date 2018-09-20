import styled from 'styled-components'

export const StyledButtonGroup = styled.div`
  button {
    display: ${props => (props.isVertical ? 'block' : 'inline-block')};
    margin: 0px 0px 8px 0px;
  }
`

export const StyledVolumeSlider = styled.div`
  width: 25%;
  float: right;
  margin-top: 6px;
  margin-right: 0px;
`
