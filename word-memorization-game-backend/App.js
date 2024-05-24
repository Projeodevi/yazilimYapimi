import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import Quiz from "./Quiz";
import Layout from "./Layout";
import CreateQuestion from "./CreateQuestion";
import Stats from "./Stats";

function App() {
  const token = localStorage.getItem('token');

  if (!token && window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/forgot-password') {
    return window.location.href = '/login';
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Quiz />} />
          <Route path="*" element={<Quiz />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="create-question" element={<CreateQuestion />} />
          <Route path="stats" element={<Stats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
