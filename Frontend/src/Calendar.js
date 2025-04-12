import React, { useRef, useEffect, useState, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import './main.css';
import { AuthContext } from './AuthContext';

function Calendar() {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tempSelectedUser, setTempSelectedUser] = useState(null); // Temporary state for dropdown selection
  const { userID, userRole } = useContext(AuthContext);

  useEffect(() => {
    // Fetch users, events, and participations only once
    Promise.all([
      fetch('http://localhost:8000/api/users/').then(response => response.json()),
      fetch('http://localhost:8000/api/events/with-organizer/').then(response => response.json()),
      fetch('http://localhost:8000/api/participations/').then(response => response.json())
    ])
      .then(([usersData, eventsData, participationsData]) => {
        setUsers(usersData.users);
  
        const fetchedEvents = eventsData.events.map(event => ({
          id: event.id,
          title: event.title,
          start: `${event.date_from}T${event.time_start}`,
          end: `${event.date_to}T${event.time_end}`,
          description: event.description,
          organizer: event.organizer,
          capacity: event.capacity
        }));
        setAllEvents(fetchedEvents);
  
        setParticipations(participationsData.participations);
  
        // Set the logged-in user as the selected user and filter events
        setSelectedUser(userID);
        const userEventIds = participationsData.participations
          .filter(participation => participation.user_id === parseInt(userID))
          .map(participation => participation.event_id);
  
          const userEvents = fetchedEvents.map(event => {
            const participation = participationsData.participations.find(p => p.event_id === event.id && p.user_id === parseInt(userID));
            return {
              ...event,
              className: participation?.status === 'pending' ? 'pending' : '',
            };
          });
  
        setEvents(userEvents);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [userID]); // Only run once when the component mounts or userID changes

  const handleEventDrop = (info) => {
    const updatedEvent = {
      ...info.event.extendedProps,
      id: info.event.id,
      title: info.event.title,
      start: info.event.start.toISOString(),
      end: info.event.end.toISOString()
    };
  
    // Update the events state
    setEvents(prevEvents =>
      prevEvents.map(event => (event.id === updatedEvent.id ? updatedEvent : event))
    );
  
    // Optionally, send the updated event to the backend
    fetch(`http://localhost:8000/api/events/${updatedEvent.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: updatedEvent.title,
        date_from: updatedEvent.start.split('T')[0],
        date_to: updatedEvent.end.split('T')[0],
        time_start: updatedEvent.start.split('T')[1],
        time_end: updatedEvent.end.split('T')[1],
        description: updatedEvent.description,
        organizer_id: updatedEvent.organizer.id,
        capacity: updatedEvent.capacity
      })
    })
      .then(response => {
        if (!response.ok) {
          console.error('Failed to update event');
        }
      })
      .catch(error => console.error('Error updating event:', error));
  };

  const handleAcceptEvent = () => {
    fetch(`http://localhost:8000/api/participations/${selectedEvent.id}/${userID}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'accepted' }),
    })
      .then((response) => {
        if (response.ok) {
          // Update the participations state
          const updatedParticipations = participations.map((p) =>
            p.event_id === selectedEvent.id && p.user_id === parseInt(userID)
              ? { ...p, status: 'accepted' }
              : p
          );
          setParticipations(updatedParticipations);
  
          // Update the events state to remove the 'pending' class
          const updatedEvents = events.map((event) =>
            event.id === parseInt(selectedEvent.id)
              ? { ...event, className: '' } // Remove the 'pending' class
              : event
          );
          setEvents(updatedEvents);
  
          closeModal();
        } else {
          console.error('Failed to accept event');
        }
      })
      .catch((error) => console.error('Error accepting event:', error));
  };
  
  const handleDeclineEvent = () => {
    fetch(`http://localhost:8000/api/participations/${selectedEvent.id}/${userID}/`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // Remove the participation from the state
          const updatedParticipations = participations.filter(
            (p) => !(p.event_id === parseInt(selectedEvent.id) && p.user_id === parseInt(userID))
          );
          setParticipations(updatedParticipations);
          
          // Update the events state to exclude the declined event
          const updatedEvents = events.filter((event) => event.id !== parseInt(selectedEvent.id));
          setEvents(updatedEvents);
  
          closeModal();
        } else {
          console.error('Failed to decline event');
        }
      })
      .catch((error) => console.error('Error declining event:', error));
  };
  
  const handleUserChange = (event) => {
    setTempSelectedUser(event.target.value);
  };

  const handleFilterEvents = () => {
    if (tempSelectedUser) {
      setSelectedUser(tempSelectedUser);
      const userEventIds = participations
        .filter(participation => participation.user_id === parseInt(tempSelectedUser))
        .map(participation => participation.event_id);
      const userEvents = allEvents.filter(event => userEventIds.includes(event.id));
      setEvents(userEvents); // Filter events based on the selected user
    }
  };

  const handleDeleteEvent = () => {
    const isOwner = selectedEvent.extendedProps.organizer.id === parseInt(userID) || userRole === "admin";
  
    if (isOwner) {
      // Delete the event and all participations
      fetch(`http://localhost:8000/api/events/${selectedEvent.id}/`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            // Update both events and allEvents states
            const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
            const updatedAllEvents = allEvents.filter(event => event.id !== selectedEvent.id);
            setEvents(updatedEvents);
            setAllEvents(updatedAllEvents);
  
            // Remove the event from FullCalendar
            const calendarApi = calendarRef.current.getApi();
            const calendarEvent = calendarApi.getEventById(selectedEvent.id);
            if (calendarEvent) {
              calendarEvent.remove();
            }
  
            closeModal();
          } else {
            console.error('Failed to delete event');
          }
        })
        .catch(error => console.error('Error deleting event:', error));
    } else {
      // Delete the participation
      fetch(`http://localhost:8000/api/participations/${selectedEvent.id}/${userID}/`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            // Update participations and filter events accordingly
            const updatedParticipations = participations.filter(
              p => !(p.event_id === selectedEvent.id && p.user_id === parseInt(userID))
            );
            setParticipations(updatedParticipations);
  
            // Update events based on updated participations
            const userEventIds = updatedParticipations
              .filter(participation => participation.user_id === parseInt(selectedUser))
              .map(participation => participation.event_id);
            const userEvents = allEvents.filter(event => userEventIds.includes(event.id));
            setEvents(userEvents);
  
            // Remove the event from FullCalendar if necessary
            const calendarApi = calendarRef.current.getApi();
            const calendarEvent = calendarApi.getEventById(selectedEvent.id);
            if (calendarEvent) {
              calendarEvent.remove();
            }
  
            closeModal();
          } else {
            console.error('Failed to delete participation');
          }
        })
        .catch(error => console.error('Error deleting participation:', error));
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
              eventDrop={handleEventDrop}
              dateClick={(info) => {
                const calendarApi = calendarRef.current.getApi();
                calendarApi.changeView('timeGridDay', info.dateStr);
              }}
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
            <p><strong>Organizer:</strong> {selectedEvent.extendedProps.organizer.name} {selectedEvent.extendedProps.organizer.surname}</p>
            <p><strong>Capacity:</strong> {selectedEvent.extendedProps.capacity}</p>
          </Modal.Body>
          <Modal.Footer>
            {(selectedEvent.extendedProps?.organizer?.id === parseInt(userID) || userRole === 'admin') ? (
              <Button variant="danger" onClick={handleDeleteEvent}>
                Delete Event
              </Button>
            ) : participations.some(
                (p) => {
                  return p.event_id === parseInt(selectedEvent.id) && p.user_id === parseInt(userID) && p.status === 'pending';
                }
              ) ? (
              <>
                <Button variant="success" onClick={handleAcceptEvent}>
                  Accept
                </Button>
                <Button variant="danger" onClick={handleDeclineEvent}>
                  Decline
                </Button>
              </>
            ) : null}
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