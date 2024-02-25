//// Deposit Component ./frontend/src/deposit.js

import React from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

function Deposit() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState('');
  const [variant, setVariant] = React.useState('success'); // For Alert styling
  
  return (
    <Card className="mt-3 mb-3">
      <Card.Header as="h5">Deposit</Card.Header>
      <Card.Body>
        {status && <Alert variant={variant}>{status}</Alert>}
        {show ? 
          <DepositForm setShow={setShow} setStatus={setStatus} setVariant={setVariant}/> :
          <DepositMsg setShow={setShow} setStatus={setStatus}/>
        }
      </Card.Body>
    </Card>
  );
}

function DepositMsg({ setShow, setStatus }) {
  return (
    <>
      <h5>Success</h5>
      <Button variant="primary" onClick={() => {
          setShow(true);
          setStatus('');
      }}>
        Deposit again
      </Button>
    </>
  );
}

function DepositForm({ setShow, setStatus, setVariant }) {
  const [email, setEmail] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [error, setError] = React.useState(''); // State to manage validation error for amount
  
  const MIN_DEPOSIT_AMOUNT = 1; // Define a minimum deposit amount

  function handle() {
    // Reset error state
    setError('');

    // Convert amount to a float and validate
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a positive number');
      return;
    }
    if (parsedAmount < MIN_DEPOSIT_AMOUNT) {
      setError(`Minimum deposit amount is $${MIN_DEPOSIT_AMOUNT}`);
      return;
    }

    fetch('/account/deposit', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        amount: parsedAmount
      })
    })
    .then(response => {
      if (!response.ok) {
        setVariant('danger');
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      setStatus(`Deposit successful. Your new Account Balance is: ${data.balance}`);
      setShow(false);
      setVariant('success');
    })
    .catch(error => {
      setStatus(`Deposit failed: ${error.message}`);
      console.error('Error during deposit:', error);
    });
  }

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email} 
          onChange={e => setEmail(e.currentTarget.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter amount"
          value={amount} 
          onChange={e => setAmount(e.currentTarget.value)}
          isInvalid={!!error} // Show invalid feedback if there's an error
        />
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      </Form.Group>
      <Button variant="primary" onClick={handle}>Deposit</Button>
    </Form>
  );
}

export default Deposit;