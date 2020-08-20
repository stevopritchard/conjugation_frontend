import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Router, NavLink } from 'react-router-dom';
import './Header.css';

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
                <Router>
                <NavLink onClick={() => modeChange("reference")}>Reference</NavLink>
                <NavLink onClick={() => modeChange("practise")}>Practise</NavLink>
                <NavLink onClick={() => routeChange("signin")}>Sign Out</NavLink>

                </Router>
              </Nav>
            </Navbar.Collapse>
            :
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Router>
                <NavLink onClick={() => routeChange("signin")}>Sign In</NavLink>
                <NavLink onClick={() => routeChange("register")}>Register</NavLink>

                </Router>
              </Nav>
            </Navbar.Collapse>
          }
        </Navbar>
    )
}

export default Navigation;