import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light mt-auto py-4">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Blockchain Academic Certificates</h5>
            <p className="text-muted">
              Secure, tamper-proof academic certificates using Hyperledger Fabric blockchain technology.
            </p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light">Home</a></li>
              <li><a href="/verify" className="text-light">Verify Certificate</a></li>
              <li><a href="/student/register" className="text-light">Student Registration</a></li>
              <li><a href="/university/register" className="text-light">University Registration</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <ul className="list-unstyled text-muted">
              <li><i className="bi bi-envelope me-2"></i> info@blockchain-certificates.com</li>
              <li><i className="bi bi-telephone me-2"></i> +1 (123) 456-7890</li>
              <li><i className="bi bi-geo-alt me-2"></i> 123 Blockchain Street, Tech City</li>
            </ul>
          </Col>
        </Row>
        <hr className="my-3 border-secondary" />
        <div className="text-center">
          <p className="small text-muted mb-0">
            &copy; {new Date().getFullYear()} Blockchain Academic Certificates. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
