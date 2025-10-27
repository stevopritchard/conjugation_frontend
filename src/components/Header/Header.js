import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './Header.css';

const Navigation = ({ user }) => {
  return (
    <Navbar expand="lg">
      <Navbar.Brand>
        <h1>¡Conjugado!</h1>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      {user.id ? (
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <NavLink className={'nav-link'} to="/reference">
              Reference
            </NavLink>
            <NavLink className={'nav-link'} to="/practise">
              Practise
            </NavLink>
            <NavLink className={'nav-link'} to="/signin">
              Sign Out
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      ) : (
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <NavLink className={'nav-link'} to="/signin">
              Sign In
            </NavLink>
            <NavLink className={'nav-link'} to="/register">
              Register
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      )}
    </Navbar>
  );
};

export default Navigation;
