import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000';

const UniversityProfilePage = () => {
  const { currentUser, userType } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    universityId: '',
    address: '',
    website: '',
    phoneNumber: '',
    description: '',
    logo: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUniversityProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/university/profile`, {
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile');
        }
        
        const { university } = data;
        setForm({
          name: university.name || '',
          email: university.email || '',
          universityId: university.universityId || '',
          address: university.address || '',
          website: university.website || '',
          phoneNumber: university.phoneNumber || '',
          description: university.description || '',
          logo: null,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        
        if (university.logo) {
          setLogoUrl(`${API_URL}${university.logo}`);
        }
      } catch (error) {
        setError(error.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'logo' && files && files[0]) {
      setForm({ ...form, logo: files[0] });
      // Create preview
      setLogoUrl(URL.createObjectURL(files[0]));
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
      // Create form data for file upload
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'logo') {
          if (form.logo) {
            formData.append(key, form.logo);
          }
        } else {
          formData.append(key, form[key]);
        }
      });

      const response = await fetch(`${API_URL}/university/profile`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully');
    } catch (error) {
      setError(error.message || 'An error occurred while updating profile');
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
      const response = await fetch(`${API_URL}/university/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      setSuccess('Password changed successfully');
      
      // Reset password fields
      setForm({
        ...form,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setError(error.message || 'An error occurred while changing password');
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
      <h2 className="mb-4">University Profile</h2>
      
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <div className="university-logo-container mb-3">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="University Logo"
                    className="university-logo img-fluid mb-3"
                    style={{ maxHeight: '150px' }}
                  />
                ) : (
                  <div className="logo-placeholder d-flex align-items-center justify-content-center bg-light p-4 mb-3" style={{ height: '150px' }}>
                    <i className="bi bi-building fs-1"></i>
                  </div>
                )}
              </div>
              <h4>{form.name}</h4>
              <p className="text-muted">ID: {form.universityId}</p>
              {form.website && (
                <p>
                  <a href={form.website} target="_blank" rel="noopener noreferrer">
                    {form.website}
                  </a>
                </p>
              )}
              
              <div className="mt-4">
                <label className="btn btn-outline-primary w-100">
                  Change University Logo
                  <input
                    type="file"
                    name="logo"
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
              <h5 className="mb-3">University Information</h5>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>University Name</Form.Label>
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
                      <Form.Label>University ID/Registration Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="universityId"
                        value={form.universityId}
                        onChange={handleChange}
                        required
                        readOnly
                      />
                      <Form.Text className="text-muted">
                        University ID cannot be changed
                      </Form.Text>
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
                
                <Form.Group className="mb-3">
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="url"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="address"
                    rows={3}
                    value={form.address}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>University Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Provide a brief description about your university"
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
              <h5>Certificate Issuance Settings</h5>
              <p className="text-muted">Configure default settings for certificate issuance</p>
              
              <Form.Group className="mb-3">
                <Form.Label>Default Certificate Validity Period</Form.Label>
                <Form.Select defaultValue="unlimited">
                  <option value="unlimited">Unlimited (No Expiry)</option>
                  <option value="1y">1 Year</option>
                  <option value="2y">2 Years</option>
                  <option value="5y">5 Years</option>
                  <option value="10y">10 Years</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="auto-approve"
                  label="Auto-approve student certificate requests"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="notify-students"
                  label="Notify students by email when certificates are issued"
                  defaultChecked
                />
              </Form.Group>
              
              <div className="d-grid">
                <Button variant="outline-primary" disabled>
                  Save Settings
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UniversityProfilePage;
