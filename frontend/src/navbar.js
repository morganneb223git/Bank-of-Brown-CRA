///NavBar Component ./frontend/src/navbar.js

import React from 'react';
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';

function NavBar() {
  const { isAuthenticated, logout, user } = useAuth0();

  return (
    <Navbar bg="light" expand="md"> {/* Adjust the breakpoint as needed */}
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Bank of Brown</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/createaccount/">
              <Nav.Link>Create Bank Account</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/deposit/">
              <Nav.Link>Deposit</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/withdraw/">
              <Nav.Link>Withdraw</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/balance/">
              <Nav.Link>Balance</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/alldata/">
              <Nav.Link>All Data</Nav.Link>
            </LinkContainer>
          </Nav>
          {isAuthenticated && (
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {user.email} {/* Display the user's email or any identifier */}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <LinkContainer to="/profile">
                  <Dropdown.Item as="button">Profile</Dropdown.Item>
                </LinkContainer>
                {/* If you have other navigation items, they can be included similarly */}
                <Dropdown.Item onClick={() => logout({ returnTo: window.location.origin })}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;