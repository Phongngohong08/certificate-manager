import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:3002/api'; // Adjust the API URL as needed

const CertificatesListPage = () => {
  const { userType } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('dateOfIssue');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const endpoint = userType === 'university' ? 'university/certificates' : 'student/certificates';
        const response = await fetch(`${API_URL}/${endpoint}`, {
          credentials: 'include',
        });
        const data = await response.json();
        
        if (response.ok) {
          setCertificates(data.certificates || []);
        }
      } catch (error) {
        console.error('Error fetching certificates', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [userType]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Filter and sort certificates
  const filteredCertificates = certificates
    .filter(cert => {
      const searchTerm = filter.toLowerCase();
      return (
        cert._id.toLowerCase().includes(searchTerm) ||
        (cert.studentName && cert.studentName.toLowerCase().includes(searchTerm)) ||
        (cert.universityName && cert.universityName.toLowerCase().includes(searchTerm)) ||
        cert.courseName.toLowerCase().includes(searchTerm) ||
        cert.programName.toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'dateOfIssue':
          comparison = new Date(a.dateOfIssue) - new Date(b.dateOfIssue);
          break;
        case 'courseName':
          comparison = a.courseName.localeCompare(b.courseName);
          break;
        case 'studentName':
          if (a.studentName && b.studentName) {
            comparison = a.studentName.localeCompare(b.studentName);
          }
          break;
        case 'universityName':
          if (a.universityName && b.universityName) {
            comparison = a.universityName.localeCompare(b.universityName);
          }
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">{userType === 'university' ? 'Issued Certificates' : 'My Certificates'}</h2>
            {userType === 'university' && (
              <Link to="/university/issue">
                <Button variant="primary">Issue New Certificate</Button>
              </Link>
            )}
          </div>
          
          <Row className="mb-4">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search certificates..."
                  value={filter}
                  onChange={handleFilterChange}
                />
              </InputGroup>
            </Col>
            <Col md={6} className="d-flex justify-content-end align-items-center">
              <Form.Label className="me-2 mb-0">Sort by:</Form.Label>
              <Form.Select 
                value={sortBy}
                onChange={handleSortChange}
                style={{ width: 'auto' }}
                className="me-2"
              >
                <option value="dateOfIssue">Issue Date</option>
                <option value="courseName">Course Name</option>
                {userType === 'university' && (
                  <option value="studentName">Student Name</option>
                )}
                {userType === 'student' && (
                  <option value="universityName">University Name</option>
                )}
              </Form.Select>
              <Button 
                variant="outline-secondary" 
                onClick={toggleSortOrder}
                size="sm"
              >
                {sortOrder === 'asc' ? <i className="bi bi-sort-up"></i> : <i className="bi bi-sort-down"></i>}
              </Button>
            </Col>
          </Row>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading certificates...</p>
            </div>
          ) : filteredCertificates.length > 0 ? (
            <Table responsive hover className="certificate-table">
              <thead>
                <tr>
                  <th>Certificate ID</th>
                  {userType === 'university' && <th>Student</th>}
                  {userType === 'student' && <th>University</th>}
                  <th>Course/Degree</th>
                  <th>Issue Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.map((cert) => (
                  <tr key={cert._id}>
                    <td className="cert-id">
                      <span className="badge bg-light text-dark">
                        {cert._id.substring(0, 8)}...
                      </span>
                    </td>
                    {userType === 'university' && <td>{cert.studentName}</td>}
                    {userType === 'student' && <td>{cert.universityName}</td>}
                    <td>{cert.courseName}</td>
                    <td>{new Date(cert.dateOfIssue).toLocaleDateString()}</td>
                    <td>
                      <Badge bg={cert.revoked ? 'danger' : 'success'}>
                        {cert.revoked ? 'Revoked' : 'Active'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex">
                        <Link 
                          to={`/${userType}/certificates/${cert._id}`}
                          className="me-2"
                        >
                          <Button variant="outline-primary" size="sm">
                            <i className="bi bi-eye me-1"></i> View
                          </Button>
                        </Link>
                        
                        {userType === 'university' && !cert.revoked && (
                          <Button variant="outline-danger" size="sm">
                            <i className="bi bi-x-circle me-1"></i> Revoke
                          </Button>
                        )}
                        
                        {userType === 'student' && (
                          <Button variant="outline-secondary" size="sm">
                            <i className="bi bi-share me-1"></i> Share
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-file-earmark-x fs-1 text-muted"></i>
              <p className="mt-3">No certificates found</p>
              {userType === 'university' && (
                <Link to="/university/issue">
                  <Button variant="primary">Issue Certificate</Button>
                </Link>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CertificatesListPage;
