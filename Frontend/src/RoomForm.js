import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import './main.css';

function RoomForm() {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const room = {
      name,
      capacity: parseInt(capacity)
    };
    fetch('http://localhost:8000/api/rooms/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(room)
    })
      .then(response => response.json())
      .then(data => {
        setMessage('Room created successfully!');
        setVariant('success');
        setName('');
        setCapacity('');
      })
      .catch(error => {
        setMessage('Error creating room.');
        setVariant('danger');
        console.error('Error:', error);
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2>Create Room</h2>
          {message && <Alert variant={variant}>{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter room name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formCapacity">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3 btn-black">
              Create Room
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default RoomForm;