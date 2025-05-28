import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Tabs, Tab } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [key, setKey] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isMountedRef.current) return;
    
    setError('');
    setLoading(true);

    try {
      const credentials = { email, password };
      await login(credentials, key);
      
      if (isMountedRef.current) {
        navigate(key === 'student' ? '/student/dashboard' : '/university/dashboard');
      }
    } catch (error) {
      if (isMountedRef.current) {
        setError(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
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
        <Col md={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Đăng nhập</h2>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Tabs
                id="login-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-4"
              >
                <Tab eventKey="student" title="Student">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                    
                    <div className="d-grid">
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading}
                        size="lg"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang đăng nhập...
                          </>
                        ) : (
                          'Đăng nhập Student'
                        )}
                      </Button>
                    </div>
                  </Form>
                </Tab>
                
                <Tab eventKey="university" title="University">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                    
                    <div className="d-grid">
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading}
                        size="lg"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang đăng nhập...
                          </>
                        ) : (
                          'Đăng nhập University'
                        )}
                      </Button>
                    </div>
                  </Form>
                </Tab>
              </Tabs>
              
              <div className="text-center mt-4">
                <p>
                  Chưa có tài khoản?{' '}
                  <Link to="/register">Đăng ký tại đây</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
