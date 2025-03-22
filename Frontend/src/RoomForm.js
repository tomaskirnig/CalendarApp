import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function RoomForm() {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');

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
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2>Create Room</h2>
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

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Create Room
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default RoomForm;