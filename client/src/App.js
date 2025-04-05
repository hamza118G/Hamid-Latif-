import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Header2 from './components/Header2';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import AddRecord from './components/AddRecord';
import EditRecord from './components/EditRecord';
import EditUser from './components/EditUser';

function Layout() {
  const location = useLocation();
  
  return (
    <div className="d-flex flex-column min-vh-100">
      {location.pathname === '/' ? <Header2 /> : <Header />}
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-record" element={<AddRecord />} />
          <Route path="/edit-record/:id" element={<EditRecord />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
