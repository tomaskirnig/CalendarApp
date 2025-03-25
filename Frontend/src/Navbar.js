import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import './main.css';

function NavigationBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="flex-column">
      <Navbar.Brand as={Link} to="/">CalendarApp</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="flex-column">
          <Nav.Link as={Link} to="/">Login</Nav.Link>
          <Nav.Link as={Link} to="/calendar">Calendar</Nav.Link>
          <Nav.Link as={Link} to="/create-user">Create User</Nav.Link>
          <Nav.Link as={Link} to="/create-room">Create Room</Nav.Link>
          <Nav.Link as={Link} to="/create-event">Create Event</Nav.Link>
          <Nav.Link as={Link} to="/create-participation">Create Participation</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;