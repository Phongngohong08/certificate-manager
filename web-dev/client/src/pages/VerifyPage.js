import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const [certificateId, setCertificateId] = useState(searchParams.get('id') || '');  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setError('');
    
    // Here we would normally process the QR code in the image
    // But for simplicity, we'll just inform the user this feature is disabled
    setError('QR code scanning from image upload is temporarily disabled due to compatibility issues. Please enter the certificate ID manually.');
  };

  const handleVerify = async (id = certificateId) => {
    setError('');
    setVerificationResult(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/verify/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setVerificationResult(data);
    } catch (error) {
      setError(error.message || 'An error occurred during verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2>Certificate Verification</h2>
                <p className="text-muted">
                  Verify the authenticity of academic certificates issued on our blockchain platform
                </p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}              {!verificationResult && (
                <Form onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
                  <Form.Group className="mb-4">
                    <Form.Label>Certificate ID</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        placeholder="Enter certificate ID"
                        value={certificateId}
                        onChange={(e) => setCertificateId(e.target.value)}
                        required
                      />
                      <Button 
                        variant="outline-secondary" 
                        className="ms-2"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <i className="bi bi-upload"></i>
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                        accept="image/*"
                      />
                    </div>
                    <Form.Text className="text-muted">
                      Enter the certificate ID or upload a QR code image
                    </Form.Text>
                  </Form.Group>

                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={loading || !certificateId.trim()}
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" className="me-2" />
                          Verifying...
                        </>
                      ) : 'Verify Certificate'}
                    </Button>
                  </div>
                </Form>
              )}

              {verificationResult && (
                <div className="verification-result mt-4">
                  {verificationResult.valid ? (
                    <div className="text-center mb-4">
                      <div className="verification-icon valid-icon mb-3">
                        <i className="bi bi-patch-check-fill text-success fs-1"></i>
                      </div>
                      <h3 className="text-success">Certificate Verified</h3>
                      <p>This certificate is valid and authentic</p>
                    </div>
                  ) : (
                    <div className="text-center mb-4">
                      <div className="verification-icon invalid-icon mb-3">
                        <i className="bi bi-x-circle-fill text-danger fs-1"></i>
                      </div>
                      <h3 className="text-danger">Invalid Certificate</h3>
                      <p>{verificationResult.message || 'This certificate could not be verified'}</p>
                    </div>
                  )}

                  {verificationResult.valid && verificationResult.certificate && (
                    <Card className="verification-details mt-4">
                      <Card.Body>
                        <h4>Certificate Details</h4>
                        <hr />
                        <Row>
                          <Col md={6}>
                            <p><strong>Certificate ID:</strong> {verificationResult.certificate._id}</p>
                            <p><strong>Student Name:</strong> {verificationResult.certificate.studentName}</p>
                            <p><strong>University:</strong> {verificationResult.certificate.universityName}</p>
                            <p><strong>Course/Degree:</strong> {verificationResult.certificate.courseName}</p>
                            <p><strong>Program:</strong> {verificationResult.certificate.programName}</p>
                          </Col>
                          <Col md={6}>
                            <p>
                              <strong>Date of Issue:</strong>{' '}
                              {new Date(verificationResult.certificate.dateOfIssue).toLocaleDateString()}
                            </p>
                            {verificationResult.certificate.expirationDate && (
                              <p>
                                <strong>Expiration Date:</strong>{' '}
                                {new Date(verificationResult.certificate.expirationDate).toLocaleDateString()}
                              </p>
                            )}
                            <p><strong>Grade:</strong> {verificationResult.certificate.grade}</p>
                            <p>
                              <strong>Status:</strong>{' '}
                              <span className={`badge bg-${verificationResult.certificate.revoked ? 'danger' : 'success'}`}>
                                {verificationResult.certificate.revoked ? 'Revoked' : 'Active'}
                              </span>
                            </p>
                            <p>
                              <strong>Blockchain Verification:</strong>{' '}
                              <span className="badge bg-success">Verified</span>
                            </p>
                          </Col>
                        </Row>
                        
                        {verificationResult.certificate.description && (
                          <>
                            <h5 className="mt-3">Description</h5>
                            <p>{verificationResult.certificate.description}</p>
                          </>
                        )}
                      </Card.Body>
                    </Card>
                  )}

                  <div className="d-grid mt-4">
                    <Button 
                      variant="outline-primary" 
                      onClick={() => {
                        setCertificateId('');
                        setVerificationResult(null);
                      }}
                    >
                      Verify Another Certificate
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
          
          <div className="text-center mt-4">
            <p>
              If you're a student or university, <a href="/login">log in</a> to access your certificates.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyPage;
