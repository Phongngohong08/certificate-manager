import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Tabs, Tab } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [key, setKey] = useState('student');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Student specific fields
    studentId: '',
    dateOfBirth: '',
    program: '',
    // University specific fields
    universityId: '',
    address: '',
    website: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Prepare data based on user type
      const userData = key === 'student' 
        ? {
            name: form.name,
            email: form.email,
            password: form.password,
            studentId: form.studentId,
            dateOfBirth: form.dateOfBirth,
            program: form.program
          }
        : {
            name: form.name,
            email: form.email,
            password: form.password,
            universityId: form.universityId,
            address: form.address,
            website: form.website,
            phoneNumber: form.phoneNumber
          };

      await register(userData, key);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setError(error.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Register</h2>
              
              {error && <Alert variant="danger">{error}</Alert>}
              {success && (
                <Alert variant="success">
                  Registration successful! You will be redirected to login page.
                </Alert>
              )}
              
              <Tabs
                id="register-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-4"
              >
                <Tab eventKey="student" title="Student">
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirm Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Student ID</Form.Label>
                          <Form.Control
                            type="text"
                            name="studentId"
                            value={form.studentId}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Birth</Form.Label>
                          <Form.Control
                            type="date"
                            name="dateOfBirth"
                            value={form.dateOfBirth}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Program/Degree</Form.Label>
                          <Form.Control
                            type="text"
                            name="program"
                            value={form.program}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <div className="d-grid mt-4">
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading || success}
                      >
                        {loading ? 'Registering...' : 'Register as Student'}
                      </Button>
                    </div>
                  </Form>
                </Tab>
                
                <Tab eventKey="university" title="University">
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>University Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirm Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>University ID/Registration Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="universityId"
                            value={form.universityId}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Official Website</Form.Label>
                          <Form.Control
                            type="url"
                            name="website"
                            value={form.website}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            rows={3}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Contact Phone</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <div className="d-grid mt-4">
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading || success}
                      >
                        {loading ? 'Registering...' : 'Register as University'}
                      </Button>
                    </div>
                  </Form>
                </Tab>
              </Tabs>
              
              <div className="text-center mt-4">
                <p>
                  Already have an account?{' '}
                  <Link to="/login">Login here</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
