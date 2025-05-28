import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Tabs, Tab, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [key, setKey] = useState('student');
  const [form, setForm] = useState({
    // Common
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // University only
    description: '',
    location: '',
    country: 'Vietnam',
  });  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isMountedRef.current) {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isMountedRef.current) return;
    
    setError('');
    setLoading(true);    if (form.password !== form.confirmPassword) {
      if (isMountedRef.current) {
        setError('Mật khẩu xác nhận không khớp');
        setLoading(false);
      }
      return;
    }

    try {
      let userData;
      if (key === 'student') {
        userData = {
          name: form.name,
          email: form.email,
          password: form.password
        };
      } else {
        userData = {
          name: form.name,
          email: form.email,
          password: form.password,
          description: form.description,
          location: form.location,
          country: form.country
        };
      }      await register(userData, key);
        if (isMountedRef.current) {
        setSuccess(true);
        setShowToast(true);
        // Hiển thị thông báo trong 5 giây thay vì 3 giây để người dùng có thể đọc
        setTimeout(() => {
          if (isMountedRef.current) {
            navigate('/login');
          }
        }, 5000);
      }} catch (error) {
      if (isMountedRef.current) {
        setError(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Đăng ký</h2>
                {error && <Alert variant="danger">{error}</Alert>}
              {success && (
                <Alert variant="success">
                  <Alert.Heading>🎉 Đăng ký thành công!</Alert.Heading>
                  <p>
                    Tài khoản của bạn đã được tạo thành công. Bạn sẽ được chuyển hướng đến trang đăng nhập trong vài giây.
                  </p>
                  <hr />
                  <p className="mb-0">
                    <strong>Chú ý:</strong> Vui lòng sử dụng email và mật khẩu vừa đăng ký để đăng nhập.
                  </p>
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
                      <div className="d-grid mt-4">
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading || success}
                        size="lg"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang đăng ký...
                          </>
                        ) : success ? (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Đăng ký thành công!
                          </>
                        ) : (
                          'Đăng ký Student'
                        )}
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
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Location</Form.Label>
                          <Form.Control
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Country/Region</Form.Label>
                          <Form.Select
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            required
                          >
                            <option value="Vietnam">Vietnam</option>
                            <option value="Bangladesh">Bangladesh</option>
                            <option value="India">India</option>
                            <option value="China">China</option>
                            <option value="Hong Kong">Hong Kong</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                      <div className="d-grid mt-4">
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading || success}
                        size="lg"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang đăng ký...
                          </>
                        ) : success ? (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Đăng ký thành công!
                          </>
                        ) : (
                          'Đăng ký University'
                        )}
                      </Button>
                    </div>
                  </Form>
                </Tab>
              </Tabs>
                <div className="text-center mt-4">
                <p>
                  Đã có tài khoản?{' '}
                  <Link to="/login">Đăng nhập tại đây</Link>
                </p>
              </div>
            </Card.Body>          </Card>
        </Col>
      </Row>
      
      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={5000} 
          autohide
          bg="success"
          className="text-white"
        >
          <Toast.Header>
            <i className="bi bi-check-circle-fill me-2 text-success"></i>
            <strong className="me-auto">Thành công!</strong>
          </Toast.Header>
          <Toast.Body>
            <strong>Đăng ký thành công!</strong><br />
            Bạn sẽ được chuyển hướng đến trang đăng nhập.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default RegisterPage;
