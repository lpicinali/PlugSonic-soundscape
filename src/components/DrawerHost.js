import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const drawerSize = "240px"

const Drawer = styled.div`
  width: ${drawerSize};
  overflow: hidden;
  transition: width 1s;
`

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;

  & .hidden {
    width: 0px;
  }
`

const Body = styled.div`
  flex-grow: 1;
`

class DrawerHost extends PureComponent {
  render() {
    const { children, left, showLeft, right, showRight } = this.props

    const leftDrawer =
      <Drawer className={!showLeft && "hidden"}>
        {left}
      </Drawer>

    const rightDrawer =
      <Drawer className={!showRight && "hidden"}>
        {right}
      </Drawer>

    return (
      <Container>
        {left && leftDrawer}
        <Body>
          {children}
        </Body>
        {right && rightDrawer}
      </Container>
    )
  }
}

DrawerHost.defaultProps = {
  children: null,
  showLeft: false,
  showRight: false,
}

DrawerHost.propTypes = {
  children: PropTypes.node,
  left: PropTypes.node.isRequired,
  right: PropTypes.node.isRequired,
  showLeft: PropTypes.bool,
  showRight: PropTypes.bool,
}

export default DrawerHost
