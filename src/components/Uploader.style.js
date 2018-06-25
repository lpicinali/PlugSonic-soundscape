import styled from 'styled-components'
import ReactDropzone from 'react-dropzone'
import Icon from "material-ui/svg-icons/av/library-music"
import TextField from 'material-ui/TextField'
import { GRAY } from 'src/styles/colors'

export const StyledTextField = styled(TextField)`
  width: 50% !important;
  margin-right: 5%;
  margin-top: -20px;
`

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 10px;

  display: flex;
  align-items: left;
  justify-content: left;

`

export const Dropzone = styled(ReactDropzone)`
  width: 90%;
  height: 90%;
  padding: 0px 20px 10px 20px;

  display: flex;
  align-items: left;
  justify-content: center;
  text-align: center;

  border: dashed thin #666;
  border-radius: 5px;

  color: ${GRAY};
  font-size: 12px;
`

export const ActionIcon = styled(Icon)`
  width: 20px !important;
  height: 20px !important;
  color: gray !important;
  margin: 10px;
`
