///Balance Component ./frontend/src/balance.js

import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

function Balance() {
  const [email, setEmail] = useState('');
  const [balance, setBalance] = useState(null); // Use null to easily check if balance has been set
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleCheckBalance = () => {
    setStatus(''); // Clear previous status
    setError(''); // Clear previous errors
    console.log(`Fetching balance for email: ${email}`);
    fetch(`/account/balance/${email}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setBalance(data.balance); // Assuming the API returns { balance: number }
        setStatus(`Balance retrieved successfully for ${email}`);
      })
      .catch(error => {
        console.error('Error fetching balance:', error);
        setError(`Error fetching balance: ${error.message}`);
        setBalance(null); // Reset balance on error
      });
  };

  return (
    <Card className="mt-3 mb-3">
      <Card.Header>Check Balance</Card.Header>
      <Card.Body>
        {status && <Alert variant="info">{status}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Enter email" 
              value={email} 
              onChange={e => setEmail(e.currentTarget.value)} />
          </Form.Group>
          <Button variant="primary" onClick={handleCheckBalance}>
            Check Balance
          </Button>
          {/* Display balance if it has been set */}
          {balance !== null && (
            <Alert variant="success" className="mt-3">
              Your balance is: {balance}
            </Alert>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
}

export default Balance;