import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../config/axios';

const IssueCertificatePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [students, setStudents] = useState([]);  const [formData, setFormData] = useState({
    studentId: '', // For tracking selected student
    studentName: '',
    studentEmail: '',
    universityName: '',
    universityEmail: '',
    major: '',
    departmentName: '',
    cgpa: '',
    dateOfIssue: new Date().toISOString().split('T')[0],
    certificateId: ''
  });
  useEffect(() => {
    // Fetch registered students
    const fetchStudents = async () => {
      try {
        const { data } = await axiosInstance.get('student/list');
        setStudents(data.students || []);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    // Set university information from current user
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        universityName: currentUser.name || '',
        universityEmail: currentUser.email || ''
      }));
    }

    fetchStudents();
  }, [currentUser]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If student is selected, update student info
    if (name === 'studentId') {
      const selectedStudent = students.find(student => student._id === value);
      if (selectedStudent) {
        setFormData(prev => ({
          ...prev,
          studentId: value,
          studentName: selectedStudent.name,
          studentEmail: selectedStudent.email
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          studentId: value,
          studentName: '',
          studentEmail: ''
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Auto-generate certificate ID when date or major changes
    if (name === 'dateOfIssue' || name === 'major') {
      const date = name === 'dateOfIssue' ? value : formData.dateOfIssue;
      const major = name === 'major' ? value : formData.major;
      if (date && major) {
        const year = new Date(date).getFullYear();
        const majorCode = major.replace(/\s+/g, '').toUpperCase().substring(0, 4);
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const certId = `${majorCode}-${year}-${randomNum}`;
        setFormData(prev => ({ ...prev, certificateId: certId }));
      }
    }
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare data for submission (exclude studentId as it's not part of the schema)
      const certificateData = {
        studentName: formData.studentName,
        studentEmail: formData.studentEmail,
        universityName: formData.universityName,
        universityEmail: formData.universityEmail,
        major: formData.major,
        departmentName: formData.departmentName,
        cgpa: formData.cgpa,
        dateOfIssue: formData.dateOfIssue,
        certificateId: formData.certificateId
      };

      await axiosInstance.post('university/issue', certificateData);
      setSuccess(true);
        // Clear form
      setFormData({
        studentId: '', // For tracking selected student
        studentName: '',
        studentEmail: '',
        universityName: currentUser?.name || '',
        universityEmail: currentUser?.email || '',
        major: '',
        departmentName: '',
        cgpa: '',
        dateOfIssue: new Date().toISOString().split('T')[0],
        certificateId: ''
      });

      // Navigate to success page after 2 seconds
      setTimeout(() => {
        navigate('/university/certificates');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to issue certificate');
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
                        {student.name} ({student.email})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Major/Field of Study</Form.Label>
                  <Form.Control
                    type="text"
                    name="major"
                    placeholder="e.g. Computer Science"
                    value={formData.major}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="departmentName"
                    placeholder="e.g. School of Information Technology"
                    value={formData.departmentName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CGPA</Form.Label>
                  <Form.Control
                    type="text"
                    name="cgpa"
                    placeholder="e.g. 3.8 or 3.8/4.0"
                    value={formData.cgpa}
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
                  <Form.Label>Certificate ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="certificateId"
                    placeholder="Auto-generated or enter custom ID"
                    value={formData.certificateId}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>University Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="universityName"
                    value={formData.universityName}
                    onChange={handleChange}
                    required
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>University Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="universityEmail"
                    value={formData.universityEmail}
                    onChange={handleChange}
                    required
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            
            {formData.studentName && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Student Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.studentName}
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Student Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.studentEmail}
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
            
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
