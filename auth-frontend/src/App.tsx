import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Header from "./components/header";
import Fouter from "./components/fouter";
import Dashboard from "./pages/Dashboard";
import Profile from "./components/Profile";
import { AuthProvider } from "./authContext";
// import ProtectedRoute from "./ProtectedRoute";
import Settings from "./components/Settings";
import PrivateRoute from "./PrivateRoute";
import CreationCours from "./components/CreationCours";
import ProtectedLayout from "./pages/ProtectedLayout";
import Courses from "./pages/Courses";
import CoursePdf from "./components/CoursePdf";
import UpdateCourse from "./components/UpdateCourse";
import About from "./pages/About";
import Contact from "./pages/Contact";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/create-course" element={<CreationCours />} />
              <Route path="/update-course/:id" element={<UpdateCourse />} />
            </Route>
          </Route>
          <Route path="/full-Contenu" element={<CoursePdf />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Fouter />
      </Router>
    </AuthProvider>
  );
};

export default App;
