import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Certificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/certificates', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch certificates');
        }
        
        const data = await response.json();
        setCertificates(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching certificates:', err);
        setError('Failed to load certificates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleDownload = (id) => {
    // Implement certificate download logic
    console.log(`Downloading certificate with ID: ${id}`);
  };

  const handleVerify = (id) => {
    // Implement certificate verification logic
    console.log(`Verifying certificate with ID: ${id}`);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="mb-4">My Certificates</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {certificates.length === 0 && !error ? (
        <Alert variant="info">You don't have any certificates yet.</Alert>
      ) : (
        <Row>
          {certificates.map((cert) => (
            <Col key={cert.id} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{cert.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {cert.issuedBy} • {new Date(cert.issuedDate).toLocaleDateString()}
                  </Card.Subtitle>
                  <Card.Text>{cert.description}</Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleDownload(cert.id)}
                    >
                      Download
                    </Button>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={() => handleVerify(cert.id)}
                    >
                      Verify
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Certificates;
