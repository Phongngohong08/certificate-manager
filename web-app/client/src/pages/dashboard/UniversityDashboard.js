import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UniversityDashboard = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    degree: '',
    issueDate: new Date().toISOString().split('T')[0]
  });
  const [issuedCertificates, setIssuedCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get('/api/university/dashboard', {
          withCredentials: true
        });
        setIssuedCertificates(response.data.certificates || []);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/university/login');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch certificates');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/university/issue', formData, {
        withCredentials: true
      });

      setSuccess('Certificate issued successfully!');
      setFormData({
        studentName: '',
        studentEmail: '',
        degree: '',
        issueDate: new Date().toISOString().split('T')[0]
      });
      setIssuedCertificates([...issuedCertificates, response.data]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue certificate');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get('/api/university/logout', {
        withCredentials: true
      });
      navigate('/university/login');
    } catch (err) {
      setError('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Issue Certificates</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4>Issue New Certificate</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Student Name</label>
                  <input
                    type="text"
                    name="studentName"
                    className="form-control"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Student Email</label>
                  <input
                    type="email"
                    name="studentEmail"
                    className="form-control"
                    value={formData.studentEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Degree</label>
                  <input
                    type="text"
                    name="degree"
                    className="form-control"
                    value={formData.degree}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Issue Date</label>
                  <input
                    type="date"
                    name="issueDate"
                    className="form-control"
                    value={formData.issueDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Issue Certificate
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4>Recently Issued Certificates</h4>
            </div>
            <div className="card-body">
              {issuedCertificates.length === 0 ? (
                <p>No certificates issued yet.</p>
              ) : (
                <div className="list-group">
                  {issuedCertificates.map((certificate) => (
                    <div key={certificate.id} className="list-group-item">
                      <h6>{certificate.studentName}</h6>
                      <p className="mb-1">
                        <strong>Degree:</strong> {certificate.degree}<br />
                        <strong>Issue Date:</strong> {new Date(certificate.issueDate).toLocaleDateString()}<br />
                        <strong>Certificate ID:</strong> {certificate.id}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDashboard; 