import React, { useRef, useEffect, useState } from 'react';
import $ from 'jquery';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import './main.css';

function Calendar() {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // Fetch users from API
    fetch('http://localhost:8000/api/users/')
      .then(response => response.json())
      .then(data => {
        setUsers(data.users);
      })
      .catch(error => console.error('Error fetching users:', error));

    // Fetch events from API
    fetch('http://localhost:8000/api/events/')
      .then(response => response.json())
      .then(data => {
        const fetchedEvents = data.events.map(event => ({
          id: event.id,
          title: event.title,
          start: `${event.date_from}T${event.time_start}`,
          end: `${event.date_to}T${event.time_end}`,
          description: event.description,
          organizer_id: event.organizer_id,
          capacity: event.capacity
        }));
        setAllEvents(fetchedEvents);
      })
      .catch(error => console.error('Error fetching events:', error));

    // Fetch participations from API
    fetch('http://localhost:8000/api/participations/')
      .then(response => response.json())
      .then(data => {
        setParticipations(data.participations);
      })
      .catch(error => console.error('Error fetching participations:', error));
  }, []);

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleFilterEvents = () => {
    if (selectedUser) {
      const userEventIds = participations
        .filter(participation => participation.user_id === parseInt(selectedUser))
        .map(participation => participation.event_id);
      const userEvents = allEvents.filter(event => userEventIds.includes(event.id));
      setEvents(userEvents);
    }
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className='col-12 col-md-10 col-lg-8'>
          <Form className="mb-3">
            <Row className="align-items-end">
              <Col xs={8}>
                <Form.Group controlId="userSelect">
                  <Form.Control as="select" onChange={handleUserChange}>
                    <option value="">Select a user</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} {user.surname}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Button variant="primary" onClick={handleFilterEvents} className="w-100 btn-black">
                  Filter Events
                </Button>
              </Col>
            </Row>
          </Form>
          <div id='wrap'>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay"
              }}
              editable={true}
              droppable={true}
              events={events}
              eventClick={handleEventClick}
              slotLabelFormat={{
                hour: 'numeric',
                minute: '2-digit',
                hour12: false
              }}
              slotMinTime="00:00:00"
            />
            <div style={{ clear: 'both' }}></div>
          </div>
        </div>
      </div>
      {selectedEvent && (
        <Modal show={modalIsOpen} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedEvent.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Description:</strong> {selectedEvent.extendedProps.description}</p>
            <p><strong>Start:</strong> {selectedEvent.start.toLocaleString()}</p>
            <p><strong>End:</strong> {selectedEvent.end.toLocaleString()}</p>
            <p><strong>Organizer ID:</strong> {selectedEvent.extendedProps.organizer_id}</p>
            <p><strong>Capacity:</strong> {selectedEvent.extendedProps.capacity}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Calendar;