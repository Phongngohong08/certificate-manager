import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col md={7}>
              <h1 className="display-4 fw-bold">Academic Certificates on Blockchain</h1>
              <p className="lead">
                A secure, transparent, and tamper-proof way to issue, manage, and verify academic credentials
                using blockchain technology.
              </p>
              <div className="mt-4">
                <Link to="/verify">
                  <Button variant="light" size="lg" className="me-3">
                    Verify a Certificate
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline-light" size="lg">
                    Join the Platform
                  </Button>
                </Link>
              </div>
            </Col>
            <Col md={5} className="d-none d-md-block">
              <img
                src="/images/certificate-illustration.svg"
                alt="Certificate Illustration"
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="mb-5">
        <h2 className="text-center mb-4">How It Works</h2>
        <Row>
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div className="feature-icon mb-3">
                  <i className="bi bi-shield-check fs-1 text-primary"></i>
                </div>
                <Card.Title>For Universities</Card.Title>
                <Card.Text>
                  Issue tamper-proof certificates on blockchain, manage student records,
                  and enhance credential security.
                </Card.Text>
                <Link to="/university/login">
                  <Button variant="outline-primary">University Portal</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div className="feature-icon mb-3">
                  <i className="bi bi-mortarboard fs-1 text-primary"></i>
                </div>
                <Card.Title>For Students</Card.Title>
                <Card.Text>
                  Access and share your certificates anytime, anywhere. Control who gets to view
                  your academic credentials.
                </Card.Text>
                <Link to="/student/login">
                  <Button variant="outline-primary">Student Portal</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div className="feature-icon mb-3">
                  <i className="bi bi-search fs-1 text-primary"></i>
                </div>
                <Card.Title>For Verifiers</Card.Title>
                <Card.Text>
                  Instantly verify the authenticity of academic certificates with our
                  blockchain verification system.
                </Card.Text>
                <Link to="/verify">
                  <Button variant="outline-primary">Verify Now</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Benefits Section */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-4">Benefits of Blockchain Certificates</h2>
          <Row className="g-4">
            <Col md={3}>
              <div className="text-center">
                <i className="bi bi-lock fs-1 text-primary mb-3"></i>
                <h5>Secure & Tamper-Proof</h5>
                <p>Certificates cannot be altered once issued on the blockchain</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <i className="bi bi-clock fs-1 text-primary mb-3"></i>
                <h5>Instant Verification</h5>
                <p>Verify certificate authenticity in seconds, not days or weeks</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <i className="bi bi-globe fs-1 text-primary mb-3"></i>
                <h5>Global Accessibility</h5>
                <p>Access your certificates from anywhere around the world</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <i className="bi bi-shield fs-1 text-primary mb-3"></i>
                <h5>Privacy Control</h5>
                <p>Students control who can access their certificate information</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default HomePage;
