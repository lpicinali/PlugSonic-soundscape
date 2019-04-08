/* eslint no-unused-vars: 0 */
import styled from 'styled-components'
import ReactDropzone from 'react-dropzone'
import Icon from '@material-ui/icons/LibraryMusic'
import * as colors from 'src/styles/colors'

// -------------------------------------------------------------------------- //
// export const Container = styled.div`
//   margin-top: 20px;
// `

export const Dropzone = styled(ReactDropzone)`
  background-color: ${colors.WHITE};
  border: dashed thin #666;
  border-radius: 5px;
  color: ${colors.GRAY};
  font-size: 12px;
  text-align: center;
  margin-bottom: 20px;
`

export const ActionIcon = styled(Icon)`
  color: ${colors.GRAY} !important;
  height: 40px !important;
  margin: 10px 0px 4px 0px;
  width: 40px !important;
`
