/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */
/* global location */
/* eslint no-restricted-globals: 0 */
import styled from 'styled-components'
import { BLUE, TURQOISE, DARKGRAY, GRAY, LIGHTGRAY, WHITESMOKE, BLACK } from 'src/styles/colors.js'

export const StyledPositionController = styled.div`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  overflow: hidden;
  ${'' /* background-image: url('assets/img/memorial_map.png');
  background-repeat: no-repeat;
  background-position: center; */}
  background-color: ${LIGHTGRAY};
  border: 1px solid ${BLUE};
  border-radius: ${props => (props.isRound ? '9999px' : '5px')};
  transition: all 1s;
`

export const ListenerHandle = styled.div`
  position: relative;
  z-index: 5;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 8px 20px 8px;
  border-color: transparent transparent ${BLACK} transparent;
  position: absolute;
  text-indent: -9999px;
  overflow: hidden;
  cursor: pointer;
  touch-action: none;
`

export const SourceReach = styled.div`
  position: absolute;
  z-index: ${props => props.isEditing ? 2 : 1};
  width: ${props => props.reach * props.pixelsPerMeter.x}px;
  height: ${props => props.reach * props.pixelsPerMeter.z}px;
  background: ${props => props.isEditing ? 'rgba(243, 36, 106, 0.1)' : 'rgba(232, 232, 235, 0.5)'};
  border: 1px solid ${props => props.isEditing ? '#f3246a' : 'transparent'};
  border-radius: 100%;
  transform: translate3d(-50%, -50%, 0);
`

export const SourceHandle = styled.div`
  position: absolute;
  z-index: 2;
  width: 22px;
  height: 22px;
  background: ${TURQOISE};
  border-radius: 100%;
  cursor: pointer;
  transform: translate3d(-50%, -50%, 0);
  touch-action: none;
`
