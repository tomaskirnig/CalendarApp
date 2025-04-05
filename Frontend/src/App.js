import React, {useContext} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './Navbar';
import Calendar from './Calendar';
import Login from './Login';
import UserForm from './UserForm';
import RoomForm from './RoomForm';
import EventForm from './EventForm';
import ParticipationForm from './ParticipationForm';
import './main.css';
import { AuthContext } from './AuthContext';

function App()
{
  const { userID} = useContext(AuthContext);
  if (!userID || userID == "null")
  {
    return (
      <Router>
        <div className="App">
          <div className="App-content">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </div>
      </Router>
    );
  }
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <div className="App-content">
          <Routes>
            <Route path="/" element={<Calendar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/create-user" element={<UserForm />} />
            <Route path="/create-room" element={<RoomForm />} />
            <Route path="/create-event" element={<EventForm />} />
            <Route path="/create-participation" element={<ParticipationForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;