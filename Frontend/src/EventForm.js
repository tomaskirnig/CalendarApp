import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import './main.css';

function EventForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [organizerId, setOrganizerId] = useState('');
  const [capacity, setCapacity] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/users/')
      .then(response => response.json())
      .then(data => {
        setUsers(data.users);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const eventDetails = {
      title,
      description,
      date_from: dateFrom,
      date_to: dateTo,
      time_start: timeStart,
      time_end: timeEnd,
      organizer_id: parseInt(organizerId),
      capacity: parseInt(capacity)
    };
    fetch('http://localhost:8000/api/events/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventDetails)
    })
      .then(response => response.json())
      .then(data => {
        setMessage('Event created successfully!');
        setVariant('success');
        setTitle('');
        setDescription('');
        setDateFrom('');
        setDateTo('');
        setTimeStart('');
        setTimeEnd('');
        setOrganizerId('');
        setCapacity('');
      })
      .catch(error => {
        setMessage('Error creating event.');
        setVariant('danger');
        console.error('Error:', error);
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2>Create Event</h2>
          {message && <Alert variant={variant}>{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formDateFrom">
              <Form.Label>Date From</Form.Label>
              <Form.Control
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formDateTo">
              <Form.Label>Date To</Form.Label>
              <Form.Control
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formTimeStart">
              <Form.Label>Time Start</Form.Label>
              <Form.Control
                type="time"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formTimeEnd">
              <Form.Label>Time End</Form.Label>
              <Form.Control
                type="time"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formOrganizerId">
              <Form.Label>Organizer</Form.Label>
              <Form.Control
                as="select"
                value={organizerId}
                onChange={(e) => setOrganizerId(e.target.value)}
              >
                <option value="">Select organizer</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} {user.surname}
                  </option>
                ))}
              </Form.Control>
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
              Create Event
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default EventForm;