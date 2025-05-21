import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Welcome, {user?.name}!</Card.Title>
              <Card.Text>
                Role: {user?.role}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Quick Actions</Card.Title>
              <div className="d-grid gap-2">
                <Button as={Link} to="/certificates" variant="primary">
                  View Certificates
                </Button>
                {user?.role === 'issuer' && (
                  <Button as={Link} to="/certificates/issue" variant="success">
                    Issue New Certificate
                  </Button>
                )}
                <Button as={Link} to="/profile" variant="info">
                  Update Profile
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 