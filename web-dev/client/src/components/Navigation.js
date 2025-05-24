import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { currentUser, logout, userType } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img 
            src="/logo192.png" 
            width="30" 
            height="30" 
            className="d-inline-block align-top mr-2" 
            alt="Certificate Logo"
          />
          Academic Certificates
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/verify">Verify Certificate</Nav.Link>
            {currentUser && userType === 'university' && (
              <>
                <Nav.Link as={Link} to="/university/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/university/issue">Issue Certificate</Nav.Link>
                <Nav.Link as={Link} to="/university/certificates">Manage Certificates</Nav.Link>
              </>
            )}
            {currentUser && userType === 'student' && (
              <>
                <Nav.Link as={Link} to="/student/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/student/certificates">My Certificates</Nav.Link>
                <Nav.Link as={Link} to="/student/profile">My Profile</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {currentUser ? (
              <>
                <span className="navbar-text mr-3 text-light">
                  {currentUser.name || currentUser.email}
                </span>
                <Button variant="outline-light" onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
