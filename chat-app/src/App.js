import './App.css';
import { useState } from 'react';
import Signup from './components/signup';
import Login from './components/login';
import Chat from './components/chat';
import RoomSelector from './components/roomselector';

function App() {
  const [username, setUsername] = useState(localStorage.getItem('username') || null);
  const [room, setRoom] = useState(null);
  const [page, setPage] = useState('login'); // 'login' or 'signup'
  
  const rooms = ['devops', 'cloud computing', 'covid19', 'sports', 'movies'];

  const handleLogout = () => {
    setUsername(null);
    setRoom(null);
    setPage('login');
  };

  const handleLeaveRoom = () => {
    setRoom(null);
  };

  if (!username) {
    return (
      <div className="App mt-5">
        {page === 'login' ? (
          <>
            <Login setUsername={setUsername} />
            <p>
              Don't have an account?{' '}
              <button className="btn btn-link" onClick={() => setPage('signup')}>
                Sign Up
              </button>
            </p>
          </>
        ) : (
          <>
            <Signup onSignup={setUsername} />
            <p>
              Already have an account?{' '}
              <button className="btn btn-link" onClick={() => setPage('login')}>
                Login
              </button>
            </p>
          </>
        )}
      </div>
    );
  }

  // Once logged in, select a room or go to chat
  return (
    <div className="App">
      {room ? (
        <Chat 
          username={username} 
          room={room} 
          onLeaveRoom={handleLeaveRoom}
          onLogout={handleLogout}
        />
      ) : (
        <RoomSelector rooms={rooms} onSelectRoom={setRoom} />
      )}
    </div>
  );
}

export default App;