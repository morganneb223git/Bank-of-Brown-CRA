///NavBar Component ./frontend/src/navbar.js
import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap'; // Ensure Button is imported
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';

function NavBar() {
  const { isAuthenticated, logout } = useAuth0(); // Destructure logout method

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Bank of Brown</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/createaccount/">
              <Nav.Link>Create Account</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/login/">
              <Nav.Link>Login</Nav.Link>
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
          {/* Conditionally render Logout button if user is authenticated */}
          {isAuthenticated && (
            <Button onClick={() => logout({ returnTo: window.location.origin })} variant="outline-danger">
              Logout
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;