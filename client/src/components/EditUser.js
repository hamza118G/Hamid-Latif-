// client/src/components/EditUser.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Card, Container } from 'react-bootstrap';
import axios from 'axios';

function EditUser() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/users/${id}`, { // Use the specific user ID
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = response.data; // Assuming your backend sends back a single user object
        if (user) {
          setUsername(user.username);
          setEmail(user.email);
        } else {
          setError('User not found');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to load user');
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const updateData = { username, email };
      if (newPassword) {
      
        if (newPassword.length < 8) {
          setError('Password must be at least 8 characters long');
          return;
        }
        updateData.password = newPassword; // Send plaintext password to backend

        console.log("updateData",updateData)
      }
      await axios.put(
        `http://localhost:5000/api/auth/users/${id}`,
        updateData,
        
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/home');
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.response?.data?.message || 'Failed to update user');
    }
  };

  return (
    <Container className="my-5">
      <Card className="vibrant-card">
        <Card.Body>
          <Card.Title className="text-center mb-4">Edit User</Card.Title>
          {error && (
            <div className="text-center text-danger mb-4">{error}</div>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (leave blank to keep current)"
              />
            </Form.Group>
            <Button className="btn-vibrant w-100" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EditUser;