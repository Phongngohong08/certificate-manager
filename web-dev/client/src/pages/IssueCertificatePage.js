import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:3002/api';

const IssueCertificatePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    courseName: '',
    programName: '',
    grade: '',
    dateOfIssue: new Date().toISOString().split('T')[0],
    expirationDate: '',
    description: '',
    additionalNotes: ''
  });

  useEffect(() => {
    // Fetch registered students
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${API_URL}/student/list`, {
          headers: {
            'Authorization': `Bearer ${currentUser?.token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        
        if (response.ok) {
          setStudents(data.students || []);
        } else {
          console.error('Error fetching students:', data.error);
        }
      } catch (error) {
        console.error('Error fetching students', error);
      }
    };

    if (currentUser?.token) {
      fetchStudents();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/university/certificates/issue`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to issue certificate');
      }

      setSuccess(true);
      
      // Clear form
      setFormData({
        studentId: '',
        courseName: '',
        programName: '',
        grade: '',
        dateOfIssue: new Date().toISOString().split('T')[0],
        expirationDate: '',
        description: '',
        additionalNotes: ''
      });

      // Navigate to success page after 2 seconds
      setTimeout(() => {
        navigate(`/university/certificates/${data.certificateId}`);
      }, 2000);
    } catch (error) {
      setError(error.message || 'An error occurred while issuing certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <h2 className="mb-4">Issue New Certificate</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Certificate issued successfully!</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Student</Form.Label>
                  <Form.Select
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name} ({student.studentId})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course/Certificate Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="courseName"
                    placeholder="e.g. Bachelor of Computer Science"
                    value={formData.courseName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Program Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="programName"
                    placeholder="e.g. Computer Science"
                    value={formData.programName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Grade/CGPA</Form.Label>
                  <Form.Control
                    type="text"
                    name="grade"
                    placeholder="e.g. A or 3.8/4.0"
                    value={formData.grade}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Issue</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfIssue"
                    value={formData.dateOfIssue}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiration Date (if applicable)</Form.Label>
                  <Form.Control
                    type="date"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Certificate Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                placeholder="Enter details about this certificate or program"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                name="additionalNotes"
                rows={2}
                placeholder="Any additional information to include"
                value={formData.additionalNotes}
                onChange={handleChange}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-between mt-4">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/university/dashboard')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Issuing Certificate...
                  </>
                ) : 'Issue Certificate'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default IssueCertificatePage;
