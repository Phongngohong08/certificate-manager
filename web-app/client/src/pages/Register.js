import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      // Xóa token cũ trước khi đăng ký để tránh lỗi header quá lớn
      localStorage.removeItem('token');
      delete window.axios?.defaults?.headers?.common?.['Authorization'];
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/');
    } catch (error) {
      // Log full error for debugging
      console.error('Register error:', error, error?.response);
      setError(error.response?.data?.error || error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
              />
            </Form.Group>
            <Button
              className="w-100"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;