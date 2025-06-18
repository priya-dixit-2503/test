import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Layout from "../components/Layout";
import { useState } from 'react';
import SecurePage from "../pages/SecurePage";

export default function AppRoutes() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<Login onLogin={() => setLoggedIn(true)} />} />
          <Route path="signup" element={<Signup />} />
          <Route path="secure" element={<SecurePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

