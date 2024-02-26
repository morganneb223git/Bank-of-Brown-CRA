import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

function Withdraw() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState('');
  const [variant, setVariant] = useState('success');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [balance, setBalance] = useState(0); // Added state for balance
  const [loadingBalance, setLoadingBalance] = useState(false); // Added state for loading balance

  useEffect(() => {
    // Fetch the user's balance when the email changes
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

  function handleWithdrawal() {
    // Reset status and variant
    setStatus('');
    setVariant('success');

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
      })
      .catch(error => {
        setStatus(`Withdrawal failed: ${error.message}`);
        console.error('Error during withdrawal:', error);
        setVariant('danger');
      });
  }

  function handleWithdrawAgain() {
    setShow(true);
    setStatus('');
    setAmount('');
    setVariant('success');
  }

  return (
    <Card className="mt-3 mb-3">
      <Card.Header as="h5">Withdraw</Card.Header>
      <Card.Body>
        {status && <Alert variant={variant}>{status}</Alert>}
        {show ? (
          <WithdrawForm
            email={email}
            setEmail={setEmail}
            amount={amount}
            setAmount={setAmount}
            amountError={amountError}
            setAmountError={setAmountError}
            handleWithdrawal={handleWithdrawal}
            loadingBalance={loadingBalance}
          />
        ) : (
          <WithdrawMsg handleWithdrawAgain={handleWithdrawAgain} />
        )}
      </Card.Body>
    </Card>
  );
}

function WithdrawForm({ email, setEmail, amount, setAmount, amountError, setAmountError, handleWithdrawal, loadingBalance }) {
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
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
          isInvalid={!!amountError}
          disabled={loadingBalance} // Disable input while balance is loading
        />
        <Form.Control.Feedback type="invalid">{amountError}</Form.Control.Feedback>
      </Form.Group>
      <Button variant="primary" onClick={handleWithdrawal} disabled={loadingBalance}>
        Withdraw
      </Button>
    </Form>
  );
}

function WithdrawMsg({ handleWithdrawAgain, balance }) {
  return (
    <>
      <h5>Success</h5>
      <p>New Balance: {balance}</p> {/* Added this line to display the new balance */}
      <Button variant="primary" onClick={handleWithdrawAgain}>
        Withdraw again
      </Button>
    </>
  );
}

export default Withdraw;
