import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const Navigation = ({ routeChange, isSignedIn }) => {
    return(
        <Navbar expand="lg">
          <Navbar.Brand>
            <div className="title">
              <h1>¡Conjugado!</h1>
            </div>
          </Navbar.Brand>
          {isSignedIn 
            ?
            <Nav className="ml-auto">
              <Nav.Link onClick={() => routeChange("signin")}>Sign Out</Nav.Link>
            </Nav>
            :
            <Nav className="ml-auto">
              <Nav.Link onClick={() => routeChange("signin")}>Sign In</Nav.Link>
              <Nav.Link onClick={() => routeChange("register")}>Register</Nav.Link>
            </Nav>
          }
        </Navbar>
    )
}

export default Navigation;