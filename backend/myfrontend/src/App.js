import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [secureData, setSecureData] = useState(null);
console.log("Hello api "+loggedIn);
  useEffect(() => {
    if (!loggedIn) return;

    const token = localStorage.getItem('access_token');
    if (token) {
      axios.get('http://127.0.0.1:8000/api/ipo/2/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
  console.log("API response:", res.data);
  setSecureData(res.data);
})
      .catch(err => {
        console.error(err);
        setLoggedIn(false); // Token might be expired
      });
    }
  }, [loggedIn]);

  return (
    <div>
      {!loggedIn ? (
        <Login onLogin={() => setLoggedIn(true)} />
      ) : (
        <>
          <h1>Secure Page</h1>
          <pre>{JSON.stringify(secureData, null, 2)}</pre>
        </>
      )}
    </div>
  );
}

export default App;
