// client/src/components/Header.js
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from './Logos-01.png';

function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const isLoggedIn = !!localStorage.getItem('token');
  const isLoginPage = location.pathname === '/'; // Check if on Login page

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Navbar className="vibrant-navbar" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to={isLoggedIn ? '/home' : '/'}>
          <img src={logo} width={80} height={80} alt="LOGO" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/home">Home</Nav.Link>
                <Nav.Link as={Link} to="/add-record">Add Record</Nav.Link>
                <Nav.Link as={Link} to="/register">Add Account</Nav.Link>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              // Show "Login" only when not logged in and on the login page
              !isLoggedIn && isLoginPage && <Nav.Link as={Link} to="/">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;