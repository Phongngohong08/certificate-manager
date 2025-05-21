import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get('/api/student/dashboard', {
          withCredentials: true
        });
        setCertificates(response.data.certificates || []);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/student/login');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch certificates');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.get('/api/student/logout', {
        withCredentials: true
      });
      navigate('/student/login');
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
        <h2>My Certificates</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {certificates.length === 0 ? (
        <div className="alert alert-info">
          You don't have any certificates yet.
        </div>
      ) : (
        <div className="row">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{certificate.degree}</h5>
                  <p className="card-text">
                    <strong>University:</strong> {certificate.universityName}<br />
                    <strong>Issue Date:</strong> {new Date(certificate.issueDate).toLocaleDateString()}<br />
                    <strong>Certificate ID:</strong> {certificate.id}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => window.open(`/verify/${certificate.id}`, '_blank')}
                  >
                    View Certificate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard; 