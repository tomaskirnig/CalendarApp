import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { AuthContext } from './AuthContext';
import './main.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');
  const { login } = useContext(AuthContext);
  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
          setVariant('success');
          window.location.href = 'http://localhost:3000/calendar/';
          login(data.user_id,data.user_name, data.user_role);
        } 
        else {
          setMessage(data.error || 'Login failed');
          setVariant('danger');
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        setMessage('An error occurred while logging in.');
        setVariant('danger');
      });

    setEmail('');
    setPassword('');
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2>Login</h2>
          {message && <Alert variant={variant}>{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3 btn-black">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;