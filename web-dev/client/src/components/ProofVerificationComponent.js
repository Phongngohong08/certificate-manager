import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner, Table } from 'react-bootstrap';
import axiosInstance from '../config/axios';

const ProofVerificationComponent = () => {
  const [proofData, setProofData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleVerifyProof = async () => {
    if (!proofData.trim()) {
      setError('Please enter proof data');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const parsedProof = JSON.parse(proofData);
      
      // Validate required fields
      if (!parsedProof.certUUID || !parsedProof.disclosedData || !parsedProof.proof) {
        throw new Error('Invalid proof format. Missing required fields: certUUID, disclosedData, or proof');
      }

      const { data } = await axiosInstance.post('verify/verify', parsedProof);
      setResult(data);
    } catch (error) {
      if (error.name === 'SyntaxError') {
        setError('Invalid JSON format. Please check your proof data.');
      } else {
        setError(error.response?.data?.message || error.message || 'Failed to verify proof');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = () => {
    setProofData('');
    setResult(null);
    setError('');
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">
          <i className="bi bi-shield-check me-2"></i>
          Proof Verification
        </h5>
      </Card.Header>
      <Card.Body>
        <p className="text-muted small mb-3">
          Paste the proof data (JSON format) from selective disclosure to verify its authenticity.
        </p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>Proof Data (JSON)</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            placeholder={`{
  "certUUID": "certificate-id",
  "disclosedData": {
    "studentName": "John Doe",
    "major": "Computer Science"
  },
  "proof": {
    "proofHash": "...",
    "merkleRoot": "...",
    "nonce": "...",
    "timestamp": 1234567890,
    "certificateId": "...",
    "selectedAttributes": ["studentName", "major"],
    "status": "valid"
  }
}`}
            value={proofData}
            onChange={(e) => setProofData(e.target.value)}
            className="font-monospace"
          />
        </Form.Group>

        <div className="d-flex gap-2 mb-3">
          <Button
            variant="primary"
            onClick={handleVerifyProof}
            disabled={loading || !proofData.trim()}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Verifying...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-1"></i>
                Verify Proof
              </>
            )}
          </Button>
          
          <Button
            variant="outline-secondary"
            onClick={handleClearData}
            disabled={loading}
          >
            Clear
          </Button>
        </div>

        {result && (
          <div className="verification-result">
            {result.verified ? (
              <Alert variant="success">
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-check-circle-fill fs-4 me-2"></i>
                  <strong>Proof Verified Successfully!</strong>
                </div>
                <p className="mb-2">{result.message}</p>
                
                {result.disclosedData && (
                  <div>
                    <strong>Verified Attributes:</strong>
                    <Table size="sm" className="mt-2 mb-0" striped>
                      <tbody>
                        {Object.entries(result.disclosedData).map(([key, value]) => (
                          <tr key={key}>
                            <td><strong>{key}:</strong></td>
                            <td>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Alert>
            ) : (
              <Alert variant="danger">
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-x-circle-fill fs-4 me-2"></i>
                  <strong>Proof Verification Failed!</strong>
                </div>
                <p className="mb-0">
                  {result.message || 'The proof could not be verified. The data may have been tampered with or the proof is invalid.'}
                </p>
              </Alert>
            )}
          </div>
        )}

        <div className="mt-3">
          <small className="text-muted">
            <strong>Note:</strong> This verification checks that the disclosed attributes match the original certificate 
            data using cryptographic proofs. Only the attributes included in the proof are verified.
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProofVerificationComponent;
