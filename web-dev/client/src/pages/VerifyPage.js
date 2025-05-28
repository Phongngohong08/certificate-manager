import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Nav } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../config/axios';
import ProofVerificationComponent from '../components/ProofVerificationComponent';

const VerifyPage = () => {
  const [searchParams] = useSearchParams();  const [certificateId, setCertificateId] = useState(searchParams.get('id') || '');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('certificate');
  const fileInputRef = useRef(null);
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setError('');
    
    // Here we would normally process the QR code in the image
    // But for simplicity, we'll just inform the user this feature is disabled
    setError('QR code scanning from image upload is temporarily disabled due to compatibility issues. Please enter the certificate ID manually.');
  };

  const handleVerify = async () => {
    if (!certificateId.trim()) {
      setError('Please enter a certificate ID');
      return;
    }

    setLoading(true);
    setError('');
    setVerificationResult(null);

    try {
      const { data } = await axiosInstance.get(`verify/verify?id=${certificateId}`);
      setVerificationResult(data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to verify certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">              <div className="text-center mb-4">
                <h2>Certificate Verification</h2>
                <p className="text-muted">
                  Verify the authenticity of academic certificates issued on our blockchain platform
                </p>
              </div>              <Nav variant="tabs" className="mb-4">
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'certificate'} 
                    onClick={() => setActiveTab('certificate')}
                  >
                    <i className="bi bi-card-text me-1"></i>
                    Simple Certificate ID Verification
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'proof'} 
                    onClick={() => setActiveTab('proof')}
                  >
                    <i className="bi bi-shield-check me-1"></i>
                    Selective Disclosure Proof Verification
                  </Nav.Link>
                </Nav.Item>
              </Nav>{error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}              {activeTab === 'certificate' && (
                <>
                  <Alert variant="info" className="mb-4">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Simple Verification:</strong> Enter a certificate ID to check if it exists and is valid in our database.
                  </Alert>
                  
                  {!verificationResult && (
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
                                <p><strong>Major:</strong> {verificationResult.certificate.major}</p>
                                <p><strong>Department:</strong> {verificationResult.certificate.departmentName}</p>
                              </Col>
                              <Col md={6}>
                                <p>
                                  <strong>Date of Issue:</strong>{' '}
                                  {new Date(verificationResult.certificate.dateOfIssue).toLocaleDateString()}
                                </p>
                                <p><strong>CGPA:</strong> {verificationResult.certificate.cgpa}</p>
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
                          </Card.Body>
                        </Card>
                      )}

                      <div className="d-grid mt-4">
                        <Button 
                          variant="outline-primary" 
                          onClick={() => {
                            setCertificateId('');
                            setVerificationResult(null);
                            setError('');
                          }}
                        >
                          Verify Another Certificate
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}              {activeTab === 'proof' && (
                <>
                  <Alert variant="warning" className="mb-4">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <strong>Selective Disclosure Verification:</strong> This verifies cryptographic proofs generated from the "Create Selective Disclosure" feature. 
                    You must first generate a proof using the selective disclosure page, then paste it here for verification.
                  </Alert>
                  
                  <ProofVerificationComponent />
                </>
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
