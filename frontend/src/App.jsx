import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login'; // Make sure this is the correct file
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SecurePage from './pages/SecurePage';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/secure" element={loggedIn ? <SecurePage /> : <Login onLogin={() => setLoggedIn(true)} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
