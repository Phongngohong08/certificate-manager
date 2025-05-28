import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance, { API_URL } from '../config/axios';

const StudentProfilePage = () => {
  const { currentUser, userType } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    studentId: '',
    dateOfBirth: '',
    program: '',
    address: '',
    phoneNumber: '',
    profilePicture: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const { data } = await axiosInstance.get('student/profile');
        
        const { student } = data;
        setForm({
          name: student.name || '',
          email: student.email || '',
          studentId: student.studentId || '',
          dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
          program: student.program || '',
          address: student.address || '',
          phoneNumber: student.phoneNumber || '',
          profilePicture: null,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
          if (student.profilePicture) {
          setProfilePictureUrl(`${API_URL}/${student.profilePicture}`);
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'profilePicture' && files && files[0]) {
      setForm({ ...form, profilePicture: files[0] });
      // Create preview
      setProfilePictureUrl(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdating(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'profilePicture') {
          if (form.profilePicture) {
            formData.append(key, form.profilePicture);
          }
        } else {
          formData.append(key, form[key]);
        }
      });

      const { data } = await axiosInstance.put('student/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setSuccess('Profile updated successfully');
      
      // Reset password fields
      setForm({
        ...form,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while updating profile');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (!form.currentPassword) {
      setError('Current password is required');
      return;
    }
    
    setUpdating(true);

    try {
      const { data } = await axiosInstance.post('student/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setSuccess('Password updated successfully');
      
      // Reset password fields
      setForm({
        ...form,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update password');
    } finally {
      setUpdating(false);
    }
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

  return (
    <Container className="py-4">
      <h2 className="mb-4">Student Profile</h2>
      
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <div className="profile-picture-container mb-3">
                {profilePictureUrl ? (
                  <img
                    src={profilePictureUrl}
                    alt="Profile"
                    className="profile-picture img-fluid rounded-circle"
                  />
                ) : (
                  <div className="profile-placeholder rounded-circle d-flex align-items-center justify-content-center bg-light">
                    <i className="bi bi-person fs-1"></i>
                  </div>
                )}
              </div>
              <h4>{form.name}</h4>
              <p className="text-muted">{form.studentId}</p>
              <p className="text-muted">{form.program}</p>
              
              <div className="mt-4">
                <label className="btn btn-outline-primary w-100">
                  Change Profile Picture
                  <input
                    type="file"
                    name="profilePicture"
                    onChange={handleChange}
                    accept="image/*"
                    hidden
                  />
                </label>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm mt-4">
            <Card.Body>
              <h5 className="mb-3">Security Settings</h5>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handlePasswordChange}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={updating || !form.currentPassword || !form.newPassword}
                  >
                    {updating ? 'Updating...' : 'Change Password'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Personal Information</h5>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        readOnly
                      />
                      <Form.Text className="text-muted">
                        Email cannot be changed
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Student ID</Form.Label>
                      <Form.Control
                        type="text"
                        name="studentId"
                        value={form.studentId}
                        onChange={handleChange}
                        required
                        readOnly
                      />
                      <Form.Text className="text-muted">
                        Student ID cannot be changed
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dateOfBirth"
                        value={form.dateOfBirth}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Program/Degree</Form.Label>
                      <Form.Control
                        type="text"
                        name="program"
                        value={form.program}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-4">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="address"
                    rows={3}
                    value={form.address}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={updating}
                  >
                    {updating ? 'Updating Profile...' : 'Save Changes'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm mt-4">
            <Card.Body>
              <h5>Account Actions</h5>
              <div className="d-grid gap-2">
                <Button variant="outline-danger">
                  Request Account Deletion
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentProfilePage;
