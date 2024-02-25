/// Withdraw Component ./frontend/src/withdraw.js

import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

function Withdraw() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState('');
  const [variant, setVariant] = React.useState('success'); // For Alert styling

  return (
    <Card className="mt-3 mb-3">
      <Card.Header>Withdraw</Card.Header>
      <Card.Body>
        {status && <Alert variant={variant}>{status}</Alert>}
        {show ? (
          <WithdrawForm setShow={setShow} setStatus={setStatus} setVariant={setVariant} />
        ) : (
          <WithdrawMsg setShow={setShow} setStatus={setStatus} />
        )}
      </Card.Body>
    </Card>
  );
}

function WithdrawMsg({ setShow, setStatus }) {
  return (
    <>
      <h5>Success</h5>
      <Button variant="secondary" onClick={() => {
        setShow(true);
        setStatus('');
      }}>
        Withdraw again
      </Button>
    </>
  );
}

function WithdrawForm({ setShow, setStatus, setVariant }) {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0); // State to store the user's balance
  const [loadingBalance, setLoadingBalance] = useState(true); // State to track loading of the balance

  // Fetch the user's balance when the email changes
  useEffect(() => {
    if (email) {
      setLoadingBalance(true);
      fetch(`/account/balance/${email}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      .then(response => response.json())
      .then(data => {
        setBalance(data.balance); // Assuming the API returns an object with a balance property
        setLoadingBalance(false);
      })
      .catch(error => {
        console.error('Error fetching balance:', error);
        setLoadingBalance(false);
      });
    }
  }, [email]);

  function handle() {
    const withdrawalAmount = parseFloat(amount);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      setStatus('Amount must be a positive number.');
      setVariant('danger');
      return;
    }

    if (withdrawalAmount > balance) {
      setStatus('Withdrawal amount exceeds current balance.');
      setVariant('danger');
      return;
    }

    fetch('/account/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        amount: withdrawalAmount,
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
      setStatus(`Withdrawal successful. New Balance: ${data.balance}`);
      setShow(false);
      setVariant('success');
    })
    .catch(error => {
      setStatus(`Withdrawal failed: ${error.message}`);
      console.error('Error during withdrawal:', error);
      setVariant('danger');
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
          disabled={loadingBalance} // Disable input while loading balance
        />
      </Form.Group>
      {loadingBalance ? <p>Loading balance...</p> : <Button variant="primary" onClick={handle}>Withdraw</Button>}
    </Form>
  );
}

export default Withdraw;