import React, { useState } from 'react';
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

  // Function to fetch balance
  const fetchBalance = () => {
    if (email) {
      setLoadingBalance(true);
      fetch(`/account/balance/${email}`)
        .then(response => response.json())
        .then(data => {
          setBalance(data.balance);
          setLoadingBalance(false);
        })
        .catch(error => {
          console.error('Error fetching balance:', error);
          setLoadingBalance(false);
        });
    }
  };

  function handleWithdrawal() {
    // Reset status and variant
    setStatus('');
    setVariant('success');

    const withdrawalAmount = parseFloat(amount);
    // Validation checks

    if (withdrawalAmount > balance) {
      setStatus('Withdrawal amount exceeds current balance.');
      setVariant('danger');
      return;
    }

    // Make API call to withdraw
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
          if (response.statusText.includes('User not found')) {
            throw new Error('Withdraw failed because email is unknown. Please use login email.');
          } else {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
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
            balance={balance}
            fetchBalance={fetchBalance}
          />
        ) : (
          <WithdrawMsg handleWithdrawAgain={handleWithdrawAgain} balance={balance} />
        )}
      </Card.Body>
    </Card>
  );
}

function WithdrawForm({ email, setEmail, amount, setAmount, amountError, setAmountError, handleWithdrawal, loadingBalance, balance, fetchBalance }) {
  const [error, setError] = useState('');

    function handleAmountChange(value) {
    setAmount(value);
    validateAmount(value);
  }

  function validateAmount(value) {
    const parsedAmount = parseFloat(value);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError('Amount must be a positive number.');
    } else if (parsedAmount > balance) {
      setAmountError('Withdrawal amount exceeds current balance.');
    } else {
      setAmountError('');
    }
  }

  function handle() {
    setError(''); // Reset any previous error state

    // Validate email input
    if (!email) {
      setError('An email is required to proceed.');
      return;
    }

    // Validate amount input
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > balance) {
      setError('Invalid withdrawal amount.');
      return;
    }

    // Call handleWithdrawal function
    handleWithdrawal();
  }

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter email"
          value={email}
          onChange={e => setEmail(e.currentTarget.value)}
          onBlur={fetchBalance} // Fetch balance when the email field loses focus
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={e => handleAmountChange(e.currentTarget.value)}
          isInvalid={!!amountError || !!error}
          disabled={loadingBalance} // Disable input while balance is loading
        />
        <Form.Control.Feedback type="invalid">{amountError || error}</Form.Control.Feedback>
      </Form.Group>
      <Button variant="primary" onClick={handle} disabled={loadingBalance}>
        Withdraw
      </Button>
    </Form>
  );
}

function WithdrawMsg({ handleWithdrawAgain, balance }) {
  return (
    <>
      <h5>Success</h5>
      <p>New Balance: {balance}</p>
      <Button variant="primary" onClick={handleWithdrawAgain}>
        Withdraw again
      </Button>
    </>
  );
}

export default Withdraw;
