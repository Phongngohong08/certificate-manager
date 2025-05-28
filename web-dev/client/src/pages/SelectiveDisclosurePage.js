import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Table } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../config/axios';

const SelectiveDisclosurePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [generatedProof, setGeneratedProof] = useState(null);

  // Available certificate attributes for selective disclosure
  const availableAttributes = [
    { key: 'studentName', label: 'Student Name', description: 'Full name of the student' },
    { key: 'studentEmail', label: 'Student Email', description: 'Email address of the student' },
    { key: 'universityName', label: 'University Name', description: 'Name of the issuing university' },
    { key: 'universityEmail', label: 'University Email', description: 'Email of the issuing university' },
    { key: 'major', label: 'Major/Degree', description: 'Field of study or degree program' },
    { key: 'departmentName', label: 'Department', description: 'Academic department' },
    { key: 'cgpa', label: 'CGPA/Grade', description: 'Academic performance score' },
    { key: 'dateOfIssue', label: 'Issue Date', description: 'Date when certificate was issued' },
    { key: 'certificateId', label: 'Certificate ID', description: 'Unique certificate identifier' }
  ];

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const { data } = await axiosInstance.get(`student/certificates/${id}`);
        setCertificate(data.certificate);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load certificate');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCertificate();
    }
  }, [id]);

  const handleAttributeToggle = (attributeKey) => {
    setSelectedAttributes(prev => {
      if (prev.includes(attributeKey)) {
        return prev.filter(attr => attr !== attributeKey);
      } else {
        return [...prev, attributeKey];
      }
    });
  };

  const handleGenerateProof = async () => {
    if (selectedAttributes.length === 0) {
      setError('Please select at least one attribute to share');
      return;
    }

    setGenerating(true);
    setError('');
    setSuccess('');

    try {
      const params = new URLSearchParams({
        sharedAttributes: selectedAttributes.join(','),
        certUUID: id,
        email: currentUser.email
      });

      const { data } = await axiosInstance.get(`generateProof?${params}`);
      
      setGeneratedProof(data);
      setSuccess('Proof generated successfully! You can now share the selected attributes with verifiers.');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to generate proof');
    } finally {
      setGenerating(false);
    }
  };

  const copyProofToClipboard = () => {
    const proofData = {
      certUUID: id,
      disclosedData: generatedProof.disclosedData,
      proof: generatedProof.proof
    };
    
    navigator.clipboard.writeText(JSON.stringify(proofData, null, 2));
    setSuccess('Proof data copied to clipboard!');
  };

  const handleVerifyProof = async () => {
    if (!generatedProof) return;

    try {
      const verifyData = {
        certUUID: id,
        disclosedData: generatedProof.disclosedData,
        proof: generatedProof.proof
      };

      const { data } = await axiosInstance.post('verify/verify', verifyData);
      
      if (data.verified) {
        setSuccess('Proof verified successfully! The disclosed data is authentic.');
      } else {
        setError('Proof verification failed. The data may have been tampered with.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to verify proof');
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (!certificate) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Certificate not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>Selective Disclosure</h2>
              <p className="text-muted">Choose which certificate attributes to share while maintaining privacy</p>
            </div>
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate(`/student/certificates/${id}`)}
            >
              <i className="bi bi-arrow-left me-1"></i>
              Back to Certificate
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Row>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">
                    <i className="bi bi-check-square me-2"></i>
                    Select Attributes to Share
                  </h5>
                </Card.Header>                <Card.Body>
                  <Alert variant="info" className="mb-3">
                    <h6><i className="bi bi-info-circle me-1"></i> About Selective Disclosure:</h6>
                    <p className="mb-0">
                      This feature allows you to share specific parts of your certificate while keeping other information private. 
                      The generated proof cryptographically validates the selected attributes without revealing the complete certificate.
                    </p>
                  </Alert>
                  
                  <p className="text-muted small mb-3">
                    Select which information you want to share. Only the selected attributes will be disclosed to verifiers.
                  </p>
                  
                  <Form>
                    {availableAttributes.map(attr => (
                      <Form.Check
                        key={attr.key}
                        type="checkbox"
                        id={`attr-${attr.key}`}
                        label={
                          <div>
                            <strong>{attr.label}</strong>
                            <div className="text-muted small">{attr.description}</div>
                            {certificate[attr.key] && (
                              <div className="text-primary small">
                                Current value: {certificate[attr.key]}
                              </div>
                            )}
                          </div>
                        }
                        checked={selectedAttributes.includes(attr.key)}
                        onChange={() => handleAttributeToggle(attr.key)}
                        className="mb-3"
                      />
                    ))}
                  </Form>

                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      onClick={handleGenerateProof}
                      disabled={generating || selectedAttributes.length === 0}
                    >
                      {generating ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" className="me-2" />
                          Generating Proof...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-shield-check me-1"></i>
                          Generate Selective Disclosure Proof
                        </>
                      )}
                    </Button>
                    
                    {selectedAttributes.length === 0 && (
                      <small className="text-muted">
                        Please select at least one attribute to generate a proof
                      </small>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              {generatedProof && (
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="bi bi-file-code me-2"></i>
                      Generated Proof
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-muted small mb-3">
                      This proof contains only the selected attributes and can be used for verification.
                    </p>

                    <h6>Disclosed Data:</h6>
                    <Table size="sm" className="mb-3">
                      <tbody>
                        {Object.entries(generatedProof.disclosedData).map(([key, value]) => (
                          <tr key={key}>
                            <td><strong>{availableAttributes.find(attr => attr.key === key)?.label || key}:</strong></td>
                            <td>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <div className="d-grid gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={copyProofToClipboard}
                      >
                        <i className="bi bi-clipboard me-1"></i>
                        Copy Proof Data
                      </Button>
                      
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={handleVerifyProof}
                      >
                        <i className="bi bi-check-circle me-1"></i>
                        Test Verification
                      </Button>
                    </div>

                    <div className="mt-3">
                      <small className="text-muted">
                        <strong>How to use:</strong> Share the copied proof data with verifiers. 
                        They can use the verification API to confirm the authenticity of the disclosed attributes.
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {!generatedProof && (
                <Card className="bg-light">
                  <Card.Body className="text-center text-muted">
                    <i className="bi bi-info-circle display-4 mb-3"></i>
                    <p>Select attributes and generate a proof to see the results here.</p>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default SelectiveDisclosurePage;
