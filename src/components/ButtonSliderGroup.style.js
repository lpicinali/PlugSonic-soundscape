import styled from 'styled-components'

export const StyledButtonGroup = styled.div`
  button {
    display: ${props => (props.isVertical ? 'block' : 'inline-block')};
    margin: 0 8px 8px 0;
  }
`

export const StyledVolumeSlider = styled.div`
  width: 50%;
  float: right;
  margin-top: 6px;
`
