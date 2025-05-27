import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:3002/api'; // Adjust the API URL as needed

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentCertificates = async () => {
      try {
        const response = await fetch(`${API_URL}/student/certificates`, {
          credentials: 'include',
        });
        const data = await response.json();
        
        if (response.ok) {
          setCertificates(data.certificates || []);
        }
      } catch (error) {
        console.error('Error fetching student certificates', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentCertificates();
  }, []);

  return (
    <Container className="py-4">
      <h2 className="mb-4">Student Dashboard</h2>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Total Certificates</h6>
                  <h2>{certificates.length}</h2>
                </div>
                <div className="icon-box bg-primary-light rounded p-3">
                  <i className="bi bi-file-earmark-text fs-1 text-primary"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Profile Views</h6>
                  <h2>--</h2>
                </div>
                <div className="icon-box bg-info-light rounded p-3">
                  <i className="bi bi-eye fs-1 text-info"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Certificate Verifications</h6>
                  <h2>--</h2>
                </div>
                <div className="icon-box bg-success-light rounded p-3">
                  <i className="bi bi-shield-check fs-1 text-success"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">My Certificates</h5>
                <Link to="/student/certificates">
                  <Button variant="outline-primary" size="sm">View All</Button>
                </Link>
              </div>
              
              {loading ? (
                <p>Loading certificates...</p>
              ) : certificates.length > 0 ? (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Certificate ID</th>
                      <th>University</th>
                      <th>Course/Degree</th>
                      <th>Issue Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.slice(0, 5).map((cert) => (
                      <tr key={cert._id}>
                        <td>{cert._id.substring(0, 8)}...</td>
                        <td>{cert.universityName}</td>
                        <td>{cert.courseName}</td>
                        <td>{new Date(cert.dateOfIssue).toLocaleDateString()}</td>
                        <td>
                          <Badge bg={cert.revoked ? 'danger' : 'success'}>
                            {cert.revoked ? 'Revoked' : 'Active'}
                          </Badge>
                        </td>
                        <td>
                          <Link to={`/student/certificates/${cert._id}`} className="me-2">
                            <Button variant="outline-primary" size="sm">View</Button>
                          </Link>
                          <Button variant="outline-success" size="sm">Share</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-file-earmark-x fs-1 text-muted"></i>
                  <p className="mt-3">You don't have any certificates yet</p>
                  <p>Certificates will appear here when issued by your university</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Quick Actions</h5>
              <Row>
                <Col md={4} className="mb-3">
                  <Link to="/student/certificates" className="text-decoration-none">
                    <div className="quick-action-card border rounded p-3 text-center hover-effect">
                      <i className="bi bi-collection fs-1 text-primary mb-2"></i>
                      <h5>My Certificates</h5>
                      <p className="text-muted">View and manage all your certificates</p>
                    </div>
                  </Link>
                </Col>
                <Col md={4} className="mb-3">
                  <Link to="/student/profile" className="text-decoration-none">
                    <div className="quick-action-card border rounded p-3 text-center hover-effect">
                      <i className="bi bi-person-circle fs-1 text-success mb-2"></i>
                      <h5>My Profile</h5>
                      <p className="text-muted">Update your personal information</p>
                    </div>
                  </Link>
                </Col>
                <Col md={4} className="mb-3">
                  <Link to="/student/share" className="text-decoration-none">
                    <div className="quick-action-card border rounded p-3 text-center hover-effect">
                      <i className="bi bi-share fs-1 text-info mb-2"></i>
                      <h5>Share Credentials</h5>
                      <p className="text-muted">Create shareable links for employers</p>
                    </div>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboard;
