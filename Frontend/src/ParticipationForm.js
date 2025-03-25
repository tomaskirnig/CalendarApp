import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import './main.css';

function ParticipationForm() {
  const [userId, setUserId] = useState('');
  const [eventId, setEventId] = useState('');
  const [required, setRequired] = useState(false);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/users/')
      .then(response => response.json())
      .then(data => {
        setUsers(data.users);
      })
      .catch(error => console.error('Error fetching users:', error));

    fetch('http://localhost:8000/api/events/')
      .then(response => response.json())
      .then(data => {
        setEvents(data.events);
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const participation = {
      user_id: parseInt(userId),
      event_id: parseInt(eventId),
      required
    };
    fetch('http://localhost:8000/api/participations/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(participation)
    })
      .then(response => response.json())
      .then(data => {
        setMessage('Participation created successfully!');
        setVariant('success');
        setUserId('');
        setEventId('');
        setRequired(false);
      })
      .catch(error => {
        setMessage('Error creating participation.');
        setVariant('danger');
        console.error('Error:', error);
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2>Create Participation</h2>
          {message && <Alert variant={variant}>{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUserId">
              <Form.Label>User</Form.Label>
              <Form.Control
                as="select"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              >
                <option value="">Select user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} {user.surname}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formEventId">
              <Form.Label>Event</Form.Label>
              <Form.Control
                as="select"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
              >
                <option value="">Select event</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formRequired">
              <Form.Check
                type="checkbox"
                label="Required"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3 btn-black">
              Create Participation
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ParticipationForm;