import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Dropdown } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCode from 'qrcode.react';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000';

const CertificateDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userType } = useAuth();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sharing, setSharing] = useState(false);
  const [shareDuration, setShareDuration] = useState('24h');

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const endpoint = userType === 'university' 
          ? `university/certificates/${id}` 
          : `student/certificates/${id}`;
          
        const response = await fetch(`${API_URL}/${endpoint}`, {
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch certificate');
        }
        
        setCertificate(data.certificate);
      } catch (error) {
        setError(error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCertificate();
    }
  }, [id, userType]);

  const handleShareCertificate = async () => {
    try {
      setSharing(true);
      const response = await fetch(`${API_URL}/student/certificates/${id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ duration: shareDuration }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to share certificate');
      }
      
      // Copy link to clipboard
      navigator.clipboard.writeText(data.shareLink);
      alert('Share link copied to clipboard!');
    } catch (error) {
      setError(error.message || 'Failed to share certificate');
    } finally {
      setSharing(false);
    }
  };

  const handleRevokeCertificate = async () => {
    if (window.confirm('Are you sure you want to revoke this certificate? This action cannot be undone.')) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/university/certificates/${id}/revoke`, {
          method: 'POST',
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to revoke certificate');
        }
        
        // Refresh certificate data
        setCertificate({ ...certificate, revoked: true });
      } catch (error) {
        setError(error.message || 'Failed to revoke certificate');
      } finally {
        setLoading(false);
      }
    }
  };

  const downloadAsPDF = () => {
    const certificateElement = document.getElementById('certificate-container');
    
    html2canvas(certificateElement, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      const imgX = (pageWidth - imgWidth * ratio) / 2;
      const imgY = 20;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`certificate-${id}.pdf`);
    });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Card className="shadow-sm">
          <Card.Body className="p-4 text-center">
            <i className="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
            <h3 className="mt-3">Error</h3>
            <p>{error}</p>
            <Button 
              variant="primary" 
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (!certificate) {
    return (
      <Container className="py-5">
        <Card className="shadow-sm">
          <Card.Body className="p-4 text-center">
            <i className="bi bi-file-earmark-x fs-1 text-muted"></i>
            <h3 className="mt-3">Certificate Not Found</h3>
            <p>The requested certificate could not be found.</p>
            <Button 
              variant="primary" 
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const verificationUrl = `${window.location.origin}/verify?id=${certificate._id}`;

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back
            </Button>
            
            <div>
              {userType === 'student' && (
                <div className="d-inline-block me-2">
                  <Dropdown>
                    <Dropdown.Toggle variant="success">
                      <i className="bi bi-share me-1"></i> Share
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <div className="px-3 py-2">
                        <Form.Group className="mb-2">
                          <Form.Label>Share for</Form.Label>
                          <Form.Select
                            value={shareDuration}
                            onChange={(e) => setShareDuration(e.target.value)}
                            size="sm"
                          >
                            <option value="24h">24 hours</option>
                            <option value="7d">7 days</option>
                            <option value="30d">30 days</option>
                            <option value="permanent">Permanently</option>
                          </Form.Select>
                        </Form.Group>
                        <Button 
                          variant="success" 
                          size="sm" 
                          className="w-100"
                          onClick={handleShareCertificate}
                          disabled={sharing}
                        >
                          {sharing ? 'Generating Link...' : 'Generate Share Link'}
                        </Button>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              )}
              
              {userType === 'university' && !certificate.revoked && (
                <Button 
                  variant="danger" 
                  className="me-2"
                  onClick={handleRevokeCertificate}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Revoke Certificate
                </Button>
              )}
              
              <Button 
                variant="primary" 
                onClick={downloadAsPDF}
              >
                <i className="bi bi-download me-1"></i>
                Download PDF
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <div id="certificate-container" className="certificate-container p-4">
            <Card className="shadow-lg certificate-card">
              <Card.Body className="p-5">
                {certificate.revoked && (
                  <div className="revoked-overlay">
                    <div className="revoked-text">REVOKED</div>
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <h1 className="certificate-title">Certificate of Achievement</h1>
                  <div className="certificate-line"></div>
                </div>
                
                <div className="text-center mb-5">
                  <p className="certificate-intro">This is to certify that</p>
                  <h2 className="certificate-name">{certificate.studentName}</h2>
                  <p className="certificate-text">
                    has successfully completed the course
                  </p>
                  <h3 className="certificate-course">
                    {certificate.courseName}
                  </h3>
                  <p className="certificate-program mb-4">
                    in {certificate.programName}
                  </p>
                  
                  {certificate.grade && (
                    <p className="certificate-grade">
                      with grade: <strong>{certificate.grade}</strong>
                    </p>
                  )}
                </div>
                
                <div className="certificate-date-section mb-4">
                  <p className="certificate-date">
                    Issued on {new Date(certificate.dateOfIssue).toLocaleDateString()}
                  </p>
                  {certificate.expirationDate && (
                    <p className="certificate-expiry">
                      Valid until {new Date(certificate.expirationDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                <Row className="certificate-footer align-items-center">
                  <Col md={4}>
                    <div className="text-center">
                      <QRCode 
                        value={verificationUrl} 
                        size={100}
                        level="H"
                        renderAs="canvas"
                      />
                      <p className="mt-2 certificate-verification-text">
                        Scan to verify
                      </p>
                    </div>
                  </Col>
                  <Col md={4} className="text-center">
                    <div className="certificate-seal"></div>
                  </Col>
                  <Col md={4} className="text-end">
                    <div className="certificate-signature">
                      <div className="signature-line"></div>
                      <p>Authorized Signature</p>
                      <p className="university-name">{certificate.universityName}</p>
                    </div>
                  </Col>
                </Row>
                
                <div className="certificate-blockchain-info text-center mt-4">
                  <small className="text-muted">
                    Certificate ID: {certificate._id}<br />
                    Verified on blockchain • Tamper-proof • Immutable
                  </small>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <h4>Certificate Details</h4>
              <hr />
              <Row>
                <Col md={6}>
                  <p><strong>Certificate ID:</strong> {certificate._id}</p>
                  <p><strong>Student Name:</strong> {certificate.studentName}</p>
                  <p><strong>University:</strong> {certificate.universityName}</p>
                  <p><strong>Course/Degree:</strong> {certificate.courseName}</p>
                  <p><strong>Program:</strong> {certificate.programName}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Date of Issue:</strong> {new Date(certificate.dateOfIssue).toLocaleDateString()}</p>
                  {certificate.expirationDate && (
                    <p><strong>Expiration Date:</strong> {new Date(certificate.expirationDate).toLocaleDateString()}</p>
                  )}
                  <p><strong>Grade:</strong> {certificate.grade}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className={`badge bg-${certificate.revoked ? 'danger' : 'success'}`}>
                      {certificate.revoked ? 'Revoked' : 'Active'}
                    </span>
                  </p>
                  <p><strong>Blockchain Transaction:</strong> <code>{certificate.transactionId || 'N/A'}</code></p>
                </Col>
              </Row>
              
              {certificate.description && (
                <>
                  <h5 className="mt-3">Description</h5>
                  <p>{certificate.description}</p>
                </>
              )}
              
              {certificate.additionalNotes && (
                <>
                  <h5 className="mt-3">Additional Notes</h5>
                  <p>{certificate.additionalNotes}</p>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CertificateDetailsPage;
