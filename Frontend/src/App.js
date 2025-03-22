import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './Navbar';
import Calendar from './Calendar';
import Login from './Login';
import UserForm from './UserForm';
import RoomForm from './RoomForm';
import EventForm from './EventForm';
import ParticipationForm from './ParticipationForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/create-user" element={<UserForm />} />
          <Route path="/create-room" element={<RoomForm />} />
          <Route path="/create-event" element={<EventForm />} />
          <Route path="/create-participation" element={<ParticipationForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;