import React, { useState } from 'react';
import axios from 'axios';

const Verify = () => {
  const [certificateId, setCertificateId] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCertificate(null);

    try {
      const response = await axios.post('/api/verify', { certificateId }, {
        withCredentials: true
      });
      setCertificate(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-center">Verify Certificate</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Certificate ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </form>

              {error && (
                <div className="alert alert-danger mt-3">
                  {error}
                </div>
              )}

              {certificate && (
                <div className="mt-4">
                  <h4>Certificate Details</h4>
                  <div className="card">
                    <div className="card-body">
                      <p><strong>Student Name:</strong> {certificate.studentName}</p>
                      <p><strong>University:</strong> {certificate.universityName}</p>
                      <p><strong>Degree:</strong> {certificate.degree}</p>
                      <p><strong>Issue Date:</strong> {new Date(certificate.issueDate).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> <span className="text-success">Valid</span></p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify; 