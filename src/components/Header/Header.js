import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './Header.css'

const Navigation = ({ modeChange, routeChange, isSignedIn }) => {
    return(
        <Navbar expand="lg">
          <Navbar.Brand>
              <h1>¡Conjugado!</h1>
          </Navbar.Brand>
           <Navbar.Toggle aria-controls="basic-navbar-nav" />
          {isSignedIn 
            ?
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link onClick={() => modeChange("reference")}>Reference</Nav.Link>
                <Nav.Link onClick={() => modeChange("practise")}>Practise</Nav.Link>
                <Nav.Link onClick={() => routeChange("signin")}>Sign Out</Nav.Link>
              </Nav>
            </Navbar.Collapse>
            :
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link onClick={() => routeChange("signin")}>Sign In</Nav.Link>
                <Nav.Link onClick={() => routeChange("register")}>Register</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          }
        </Navbar>
    )
}

export default Navigation;