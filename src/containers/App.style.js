/* ----------------------- TODO ----------------------------------- *//*
    _ add min-height once elements are implented in the blocks
    _ total min-height to be set 568px (iphone se)
    _ add max-width for PlaybackContainer,SettingsIconContainer and
      ArrowsContainer when mobile in landscape mode. Set ScapeContainer
      and MasterVolContainer to use remaining space
    _ OR keep MasterVolContainer, PlaybackContainer adn SettingsIconContainer
      fixed height (e.g. 54px) and other containers use remaining space
*//* ---------------------------------------------------------------- */
/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */
/* global location */
/* eslint no-restricted-globals: 0 */
import styled, { createGlobalStyle } from 'styled-components'
import { BLACK, DARKBLUE, LIGHTBLUE, GREEN, GREY, LIGHTGREY, ORANGE, RED, TURQOISE, YELLOW, WHITE, WHITESMOKE } from 'src/styles/colors.js'
import { MAX_WIDTH } from 'src/styles/layout'

// ======================= _CONSTANTS_ ====================================== //
const headerHeight = 48;
const transitionTime = '0.5s';
const roomWidth = 30;
const roomHeight = 50;

// ======================= _GLOBAL_ ========================================= //

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:400');

  html, body {
    border: 0;
    box-sizing: border-box;
    height: 100%;
    margin: 0;
    padding: 0;
    width: 100%;
  }

  body {
    font-family: 'Roboto', sans-serif;
    font-size: 10pt;
  }
`
// ======================= _APP CONTENT_ ==================================== //

export const  AppContent  = styled.div`

  /* Smartphone Portrait */
  /* @media screen and (max-aspect-ratio: 499999/800000) { */
    align-content: flex-start;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    height: 100vh;
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    width: 100%;
  /* } */
`
// ======================= _HEADER_ ========================================= //

export const Header = styled.div`
  /* Smartphone Portrait */
  /* @media screen and (max-aspect-ratio: 499999/800000) { */
    background: ${DARKBLUE};
    box-sizing: border-box;
    height: ${headerHeight}px;
    max-width: 1280px;
    min-width: 320px;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
  /* } */
`
// ======================= _SCAPE CONTAINER_ ================================ //

export const  ScapeContainer  = styled.div`

  /* Smartphone Portrait */
  /* @media screen and (max-aspect-ratio: 499999/800000) { */
    background: ${GREEN};
    box-sizing: border-box;
    /* height: calc(50% - ${headerHeight}px); */
    max-width: 1280px;
    min-width: 320px;
    position: fixed;
    height: 50%;
    /* top: ${headerHeight}px; */
    transition: all ${transitionTime};
    width: 100%;
    z-index: 10;
  /* } */

  /* Tablet Portrait */
  @media screen and (min-aspect-ratio: 5/8) and (max-aspect-ratio: 99999/100000) {
    padding: 72px 72px 72px 72px;
    /* position: absolute;
    top: ${headerHeight}px; */
    width: ${props => props.showSettingsDrawer ? 'calc(100% - 216px)' : '100%'};
    height: calc(70% - ${headerHeight}px - 144px);
    order: 0;
    z-index: 0;
  }

  /* Tablet Landscape */
  @media screen and (min-aspect-ratio: 1/1) and (max-aspect-ratio: 799999/500000) and (max-width: 1151px) {
    padding: 72px 72px 72px 72px;
    width: ${props => props.showSettingsDrawer ? 'calc(100% - 216px)' : '100%'};
    height: calc(100vh - ${headerHeight}px - 144px);
    order: 0;
    z-index: 0;
  }

  /* Smartphone Landscape */
  @media screen and (min-aspect-ratio: 8/5) {
    min-width: 0;
    height: calc(90% - ${headerHeight}px);
    width: 50%;
  }

  /* Laptop/Desktop */
  @media screen and (min-width: 1152px) {
    padding: 72px 72px 72px 72px;
    position: absolute;
    width: ${props => props.showSettingsDrawer ? 'calc(100% - 216px)' : '100%'};
    height: calc(100vh - ${headerHeight}px - 144px);
    order: 0;
    z-index: 0;
  }
`

// ======================= _POSITION CONTROLLER_ =========================== //
export const  PositionController  = styled.div`

    /* background: url(${location.origin}/assets/img/google_maps.jpg) ${LIGHTGREY}; */
    background: ${LIGHTGREY};
    background-size: contain;
    background-repeat: no-repeat;
    /* box-sizing: border-box; */
    border: 1px solid ${BLACK};
    border-radius: 10px;
    /* width: calc(${props => props.height}px * ${roomWidth/roomHeight}); */
    width:  ${props => (roomWidth/roomHeight >= props.width/props.height) ? '${props => props.width}px'  : '${props => props.height}'};
    height: 100px;
`

// ======================= _MASTER VOL CONTAINER_ =========================== //

export const  MasterVolContainer = styled.div`

  /* Smartphone Portrait */
  /* @media screen and (max-aspect-ratio: 499999/800000) { */
    background: ${LIGHTBLUE};
    box-sizing: border-box;
    height: 10%;
    min-height: 54px;
    min-width: 320px;
    position: absolute;
    top: 50%;
    width: 100%;
    /* z-index: 10; */
    transition: all ${transitionTime};
  /* } */

  /* Tablet Portrait */
  @media screen and (min-aspect-ratio: 5/8) and (max-aspect-ratio: 99999/100000) {
    height: 72px;
    width: ${props => props.showSettingsDrawer ? 'calc(100% - 216px)' : '100%'};
    top: calc(70% - 72px);
    z-index: 0;
  }

  /* Tablet Landscape */
  @media screen and (min-aspect-ratio: 1/1) and (max-aspect-ratio: 799999/500000) and (max-width: 1151px) {
    height: 72px;
    width: ${props => (props.showSettingsDrawer || props.showArrowsDrawer) ? 'calc(100% - 216px)' : '100%'};
    top: calc(100vh - 72px);
    z-index: 0;
  }

  /* Smartphone Landscape */
  @media screen and (min-aspect-ratio: 8/5)  and (max-width: 1151px) {
    min-width: 0;
    position: fixed;
    top: 90%;
    width: 50%;
  }

  /* Laptop/Desktop */
  @media screen and (min-width: 1152px) {
    height: 72px;
    max-width: 1280px;
    width: ${props => (props.showSettingsDrawer || props.showArrowsDrawer) ? 'calc(100% - 216px)' : '100%'};
    top: calc(100vh - 72px);
    z-index: 0;
  }
`
// ======================= _PLAYBACK ICONS CONTAINER_ ======================= //

export const PlaybackContainer = styled.div`

  /* Smartphone Portrait */
  /* @media screen and (max-aspect-ratio: 499999/800000) { */
    background: ${RED};
    box-sizing: border-box;
    height: 10%;
    min-width: 240px;
    position: absolute;
    top: 60%;
    transition: all ${transitionTime};
    width: 75%;
  /* } */

  /* Laptop/Tablet Portrait */
  @media screen and (min-aspect-ratio: 5/8) and (max-aspect-ratio: 99999/100000) {
    height: 72px;
    width: ${props => props.showSettingsDrawer ? 'calc(100% - 216px)' : '100%'};
    top: calc(70% - 144px);
    z-index: 0;
  }

  /* Laptop/Tablet Landscape */
  @media screen and (min-aspect-ratio: 1/1) and (max-aspect-ratio: 799999/500000) and (max-width: 1151px) {
    height: 72px;
    width: ${props => (props.showSettingsDrawer || props.showArrowsDrawer) ? 'calc(100% - 216px)' : '100%'};
    top: calc(100vh - 144px);
    z-index: 0;
  }

  /* Smartphone Landscape */
  @media screen and (min-aspect-ratio: 8/5) and (max-width: 1151px) {
    min-width: 0;
    left: 50%;
    position: fixed;
    top: ${headerHeight}px;
    width: 37.5%;
    z-index: 10;
  }

  /* Laptop/Desktop */
  @media screen and (min-width: 1152px) {
    height: 72px;
    max-width: 1280px;
    width: ${props => (props.showSettingsDrawer || props.showArrowsDrawer) ? 'calc(100% - 216px)' : '100%'};
    top: calc(100vh - 144px);
    z-index: 0;
  }
`
// ======================= _SETTINGS ICON CONTAINER_ ======================== //

export const  SettingsIconContainer  = styled.div`

  /* Smartphone Portrait */
  /* @media screen and (max-aspect-ratio: 499999/800000) { */
    background: ${ORANGE};
    box-sizing: border-box;
    cursor: pointer;
    height: 10%;
    right: 0;
    min-width: 72px;
    position: absolute;
    top: 60%;
    width: 25%;
    transition: all ${transitionTime};
  /* } */
  @media screen and (max-width: 320px) {
    left: 240px;
  }
  /* Tablet Portrait */
  @media screen and (min-aspect-ratio: 5/8) and (max-aspect-ratio: 99999/100000) {
    right: 0;
    position: absolute;
    top: ${headerHeight}px;
    width: 72px;
    height: 72px;
  }

  /* Tablet Landscape */
  @media screen and (min-aspect-ratio: 1/1) and (max-aspect-ratio: 799999/500000) and (max-width: 1151px) {
    right: 0;
    position: absolute;
    top: ${headerHeight}px;
    width: 72px;
    height: 72px;
  }

  /* Smartphone Landscape */
  @media screen and (min-aspect-ratio: 8/5) and (max-width: 1151px) {
    right: 0;
    min-width: 0;
    position: fixed;
    top: ${headerHeight}px;
    width: 12.5%;
    z-index: 10;
  }

  /* Laptop/Desktop */
  @media screen and (min-width: 1152px) {
    right: 0;
    position: absolute;
    top: ${headerHeight}px;
    width: 72px;
    height: 72px;
  }
`
// ======================= _SETTINGS DRAWER ================================= //

export const  SettingsDrawer  = styled.div`

  /* Smartphone Portrait */
  /* @media screen and (max-aspect-ratio: 499999/800000) { */
    background: ${GREY};
    box-sizing: border-box;
    height: ${props => props.showSettingsDrawer ? '800px' : '0'};
    min-width: 320px;
    overflow: hidden;
    position: absolute;
    top: 70%;
    transition: all ${transitionTime};
    width: 100%;
  /* } */

  /* Tablet Portrait */
  @media screen and (min-aspect-ratio: 5/8) and (max-aspect-ratio: 99999/100000) {
    height: calc(100% - ${headerHeight}px - 216px);
    min-width: 0;
    right: 0;
    top: calc(72px + ${headerHeight}px);
    width: ${props => props.showSettingsDrawer ? '216px' : '0'};
  }

  /* Tablet Landscape */
  @media screen and (min-aspect-ratio: 1/1) and (max-aspect-ratio: 799999/500000) and (max-width: 1151px) {
    height: calc(100% - ${headerHeight}px - 216px);
    min-width: 0;
    right: 0;
    top: calc(72px + ${headerHeight}px);
    width: ${props => props.showSettingsDrawer ? '216px' : '0'};
  }

  /* Smartphone Landscape */
  @media screen and (min-aspect-ratio: 8/5) and (max-width: 1151px) {
    min-width: 0;
    min-width: 0;
    right: 0;
    top: calc(10vh + ${headerHeight}px);
    width: 50%;
  }

  /* Laptop/Desktop */
  @media screen and (min-width: 1152px) {
    height: calc(100% - ${headerHeight}px - 216px);
    min-width: 0;
    right: 0;
    top: calc(72px + ${headerHeight}px);
    width: ${props => props.showSettingsDrawer ? '216px' : '0'};
  }
`
// ======================= _ARROWS CONTAINER_ =============================== //

export const  ArrowsContainer  = styled.div`

  /* Smartphone Portrait */
  /* @media screen and (max-aspect-ratio: 499999/800000) { */
    background: ${YELLOW};
    box-sizing: border-box;
    /* height: ${props => props.showArrowsDrawer ? '30%' : '10%'};
    min-width: ${props => props.showArrowsDrawer ? '320px' : '80px'}; */
    height: 30%;
    min-width: 320px;
    position: absolute;
    bottom: 0;
    /* left: 0; */
    /* width: ${props => props.showArrowsDrawer ? '100%' : '25%'}; */
    width: 100%;
    transition: all ${transitionTime};
  /* } */
  /* fixes position for browser less than 320px */
  /* @media screen and (max-width: 320px) {
    left: ${props => props.showArrowsDrawer ? '0' : '240px'};
  } */

  /* Tablet Portrait */
  @media screen and (min-aspect-ratio: 5/8) and (max-aspect-ratio: 99999/100000) {
    right: 0;
    bottom: 0;
    min-width: 0;
    height: ${props => props.showArrowsDrawer ? '144px' : '72px'};
    width: ${props => props.showArrowsDrawer ? '216px' : '72px'};
  }

  /* Tablet Landscape */
  @media screen and (min-aspect-ratio: 1/1) and (max-aspect-ratio: 799999/500000) and (max-width: 1151px) {
    right: 0;
    bottom: 0;
    min-width: 0;
    height: ${props => props.showArrowsDrawer ? '144px' : '72px'};
    width: ${props => props.showArrowsDrawer ? '216px' : '72px'};
  }

  /* Smartphone Landscape */
  @media screen and (min-aspect-ratio: 8/5) and (max-width: 1151px) {
    right: 0;
    /* height: ${props => props.showArrowsDrawer ? `calc(90% - ${headerHeight}px)` : '10%'}; */
    height: calc(90% - ${headerHeight}px);
    min-width: 0;
    /* top: calc(10vh + ${headerHeight}px); */
    /* width: ${props => props.showArrowsDrawer ? '50%' : '80px'}; */
    width: 50%;
  }

  /* Laptop/Desktop */
  @media screen and (min-width: 1152px) {
    right: 0;
    bottom: 0;
    min-width: 0;
    height: ${props => props.showArrowsDrawer ? '144px' : '72px'};
    width: ${props => props.showArrowsDrawer ? '216px' : '72px'};
  }
`
