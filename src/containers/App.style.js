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
  align-content: flex-start;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
  /* Mobile Landscape */
  @media screen and (min-width: 568px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`
// ======================= _HEADER_ ========================================= //

export const Header = styled.div`
  background: ${DARKBLUE};
  box-sizing: border-box;
  height: ${headerHeight}px;
  left: 0;
  min-width: 320px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
  /* Tablet Portrait */
  @media screen and (min-width: 768px) {
    left: auto;
    position: static;
    top: auto;
  }
`
// ======================= _SCAPE CONTAINER_ ================================ //

export const  ScapeContainer  = styled.div`
  background: ${GREEN};
  box-sizing: border-box;
  height: calc(50% - ${headerHeight}px);
  min-width: 320px;
  position: fixed;
  top: ${headerHeight}px;
  width: 100%;
  z-index: 10;
  transition: all ${transitionTime};
  /* Mobile Landscape */
  @media screen and (min-width: 568px) {
    min-width: 0;
    height: calc(90% - ${headerHeight}px);
    width: 50%;
  }
  /* Tablet Portrait */
  @media screen and (min-width: 768px) {
    padding: 72px 72px 0px 72px;
    position: static;
    top: auto;
    width: ${props => props.showSettingsDrawer ? '70%' : '100%'};
    height: 50vh;
    order: 0;
    z-index: 0;
  }
`
// ======================= _MASTER VOL CONTAINER_ =========================== //

export const  MasterVolContainer = styled.div`
  background: ${LIGHTBLUE};
  box-sizing: border-box;
  height: 10%;
  min-height: 54px;
  min-width: 320px;
  position: fixed;
  top: 50%;
  width: 100%;
  z-index: 10;
  transition: all ${transitionTime};
  /* Mobile Landscape */
  @media screen and (min-width: 568px) {
    min-width: 0;
    top: 90%;
    width: 50%;
  }
  /* Tablet Portrait */
  @media screen and (min-width: 768px) {
    position: static;
    height: 72px;
    width: ${props => props.showSettingsDrawer ? '70%' : '100%'};
    order: 2;
    z-index: 0;
  }
`
// ======================= _PLAYBACK ICONS CONTAINER_ ======================= //

export const PlaybackContainer = styled.div`
  background: ${RED};
  box-sizing: border-box;
  height: 10%;
  min-width: 240px;
  position: absolute;
  top: 60%;
  transition: all ${transitionTime};
  width: 75%;
  /* Mobile Landscape */
  @media screen and (min-width: 568px) {
    min-width: 0;
    left: 50%;
    position: fixed;
    top: ${headerHeight}px;
    width: 37.5%;
    z-index: 10;
  }
  /* Tablet Portrait */
  @media screen and (min-width: 768px) {
    position: static;
    height: 72px;
    width: ${props => props.showSettingsDrawer ? '70%' : '100%'};
    order: 1;
    z-index: 0;
  }
`
// ======================= _SETTINGS ICON CONTAINER_ ======================== //

export const  SettingsIconContainer  = styled.div`
  background: ${ORANGE};
  box-sizing: border-box;
  cursor: pointer;
  height: 10%;
  right: 0;
  min-width: 80px;
  position: absolute;
  top: 60%;
  width: 25%;
  transition: all ${transitionTime};

  /* fixes position for browser less than 320px */
  @media screen and (max-width: 320px) {
    left: 240px;
  }
  /* Mobile Landscape */
  @media screen and (min-width: 568px) {
    right: 0px;
    min-width: 0;
    position: fixed;
    top: ${headerHeight}px;
    width: 12.5%;
    z-index: 10;
  }
  /* Tablet Portrait */
  @media screen and (min-width: 768px) {
    width: 72px;
    height: 72px;
  }
`
// ======================= _SETTINGS DRAWER ================================= //

export const  SettingsDrawer  = styled.div`
  overflow: hidden;
  background: ${GREY};
  box-sizing: border-box;
  height: ${props => props.showSettingsDrawer ? '800px' : '0'};
  min-width: 320px;
  position: absolute;
  top: 70%;
  width: 100%;
  transition: all ${transitionTime};
  /* Mobile Landscape */
  @media screen and (min-width: 568px) {
    right: 0%;
    min-width: 0;
    top: calc(10vh + ${headerHeight}px);
    width: 50%;
  }
  /* Tablet Portrait */
  @media screen and (min-width: 768px) {
    top: calc(72px + ${headerHeight}px);
    height: calc(85% - ${headerHeight}px - 72px);
    width: ${props => props.showSettingsDrawer ? '30%' : '0%'};
  }
`
// ======================= _ARROWS CONTAINER_ =============================== //

export const  ArrowsContainer  = styled.div`
  background: ${YELLOW};
  box-sizing: border-box;
  height: ${props => props.showArrowsDrawer ? '30%' : '10%'};
  min-width: ${props => props.showArrowsDrawer ? '320px' : '80px'};
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${props => props.showArrowsDrawer ? '100%' : '25%'};
  transition: all ${transitionTime};
  /* fixes position for browser less than 320px */
  @media screen and (max-width: 320px) {
    left: ${props => props.showArrowsDrawer ? '0' : '240px'};
  }
  /* Mobile Landscape */
  @media screen and (min-width: 568px) {
    right: 0;
    height: ${props => props.showArrowsDrawer ? `calc(90% - ${headerHeight}px)` : '10%'};
    min-width: 0;
    /* top: calc(10vh + ${headerHeight}px); */
    width: ${props => props.showArrowsDrawer ? '50%' : '80px'};
  }
  /* Tablet Portrait */
  @media screen and (min-width: 768px) {
    bottom: 0;
    top: auto;
    width: ${props => props.showArrowsDrawer ? '30%' : '72px'};
    height: ${props => props.showArrowsDrawer ? '15%' : '72px'};
  }
`
