import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000';

const UniversityDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalCertificates: 0,
    certificatesThisMonth: 0,
    pendingVerifications: 0
  });
  const [recentCertificates, setRecentCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_URL}/university/dashboard`, {
          credentials: 'include',
        });
        const data = await response.json();
        
        if (response.ok) {
          setStats({
            totalCertificates: data.stats.totalCertificates || 0,
            certificatesThisMonth: data.stats.certificatesThisMonth || 0,
            pendingVerifications: data.stats.pendingVerifications || 0
          });
          
          setRecentCertificates(data.recentCertificates || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Container className="py-4">
      <h2 className="mb-4">University Dashboard</h2>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Total Certificates</h6>
                  <h2>{stats.totalCertificates}</h2>
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
                  <h6 className="text-muted">Certificates This Month</h6>
                  <h2>{stats.certificatesThisMonth}</h2>
                </div>
                <div className="icon-box bg-success-light rounded p-3">
                  <i className="bi bi-calendar-check fs-1 text-success"></i>
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
                  <h6 className="text-muted">Pending Verifications</h6>
                  <h2>{stats.pendingVerifications}</h2>
                </div>
                <div className="icon-box bg-warning-light rounded p-3">
                  <i className="bi bi-hourglass-split fs-1 text-warning"></i>
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
                <h5 className="mb-0">Recently Issued Certificates</h5>
                <Link to="/university/certificates">
                  <Button variant="outline-primary" size="sm">View All</Button>
                </Link>
              </div>
              
              {loading ? (
                <p>Loading recent certificates...</p>
              ) : recentCertificates.length > 0 ? (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Certificate ID</th>
                      <th>Student Name</th>
                      <th>Course/Degree</th>
                      <th>Issue Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCertificates.map((cert) => (
                      <tr key={cert._id}>
                        <td>{cert._id.substring(0, 8)}...</td>
                        <td>{cert.studentName}</td>
                        <td>{cert.courseName}</td>
                        <td>{new Date(cert.dateOfIssue).toLocaleDateString()}</td>
                        <td>
                          <Badge bg={cert.revoked ? 'danger' : 'success'}>
                            {cert.revoked ? 'Revoked' : 'Active'}
                          </Badge>
                        </td>
                        <td>
                          <Link to={`/university/certificates/${cert._id}`}>
                            <Button variant="outline-secondary" size="sm">View</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-file-earmark-x fs-1 text-muted"></i>
                  <p className="mt-3">No certificates issued yet</p>
                  <Link to="/university/issue">
                    <Button variant="primary">Issue Certificate</Button>
                  </Link>
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
                  <Link to="/university/issue" className="text-decoration-none">
                    <div className="quick-action-card border rounded p-3 text-center hover-effect">
                      <i className="bi bi-plus-circle fs-1 text-primary mb-2"></i>
                      <h5>Issue New Certificate</h5>
                      <p className="text-muted">Create and issue a new certificate</p>
                    </div>
                  </Link>
                </Col>
                <Col md={4} className="mb-3">
                  <Link to="/university/certificates" className="text-decoration-none">
                    <div className="quick-action-card border rounded p-3 text-center hover-effect">
                      <i className="bi bi-list-check fs-1 text-success mb-2"></i>
                      <h5>Manage Certificates</h5>
                      <p className="text-muted">View, update, or revoke certificates</p>
                    </div>
                  </Link>
                </Col>
                <Col md={4} className="mb-3">
                  <Link to="/university/profile" className="text-decoration-none">
                    <div className="quick-action-card border rounded p-3 text-center hover-effect">
                      <i className="bi bi-gear fs-1 text-secondary mb-2"></i>
                      <h5>University Profile</h5>
                      <p className="text-muted">Update your university information</p>
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

export default UniversityDashboard;
