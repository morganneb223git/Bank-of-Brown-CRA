import React from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

/**
 * The Deposit component allows users to deposit a specified amount into their account.
 */
function Deposit() {
  const [show, setShow] = React.useState(true); // Controls the display of the deposit form or success message
  const [status, setStatus] = React.useState(''); // Status message for the user
  const [variant, setVariant] = React.useState('success'); // For styling the Alert component
  const [submitted, setSubmitted] = React.useState(false); // Tracks whether the form has been submitted
  
  return (
    <Card className="mt-3 mb-3">
      <Card.Header as="h5">Deposit</Card.Header>
      <Card.Body>
        {/* Conditional rendering of the Alert component */}
        {status && <Alert variant={variant}>{status}</Alert>}
        {show ? 
          <DepositForm setShow={setShow} setStatus={setStatus} setVariant={setVariant} setSubmitted={setSubmitted} submitted={submitted}/> :
          <DepositMsg setShow={setShow} setStatus={setStatus}/>
        }
      </Card.Body>
    </Card>
  );
}

/**
 * Displays a success message with a button to make another deposit.
 */
function DepositMsg({ setShow, setStatus }) {
  return (
    <>
      <h5>Success</h5>
      <Button variant="primary" onClick={() => {
          setShow(true); // Show the deposit form again
          setStatus(''); // Clear the status message
      }}>
        Deposit again
      </Button>
    </>
  );
}

/**
 * The form component for making a deposit.
 */
function DepositForm({ setShow, setStatus, setVariant, submitted, setSubmitted }) {
  const [email, setEmail] = React.useState(''); // Email of the user
  const [amount, setAmount] = React.useState(''); // Amount to deposit
  const [error, setError] = React.useState(''); // To manage validation errors
  
  const MIN_DEPOSIT_AMOUNT = 1; // Minimum deposit amount allowed

  /**
   * Handles the form submission. Validates the input and makes an API call to process the deposit.
   */
  function handle() {
    setError(''); // Reset any previous error state
    setSubmitted(true); // Form is being submitted

    // Validate email input
    if (!email) {
      setError('An email is required to proceed.');
      return;
    }

    // Validate amount input
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a positive number');
      return;
    }
    if (parsedAmount < MIN_DEPOSIT_AMOUNT) {
      setError(`Minimum deposit amount is $${MIN_DEPOSIT_AMOUNT}`);
      return;
    }

    // API call to perform the deposit action
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
        setVariant('danger'); // Alert styling for errors
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      setStatus(`Deposit successful. Your new Account Balance is: ${data.balance}`);
      setShow(false); // Hide the form and show the success message
      setVariant('success'); // Alert styling for success
    })
    .catch(error => {
      console.error('Error during deposit:', error); // Log the error message to the console
      setStatus(`Deposit failed: An error occurred while processing your request. Please try again later.`);
      setVariant('danger'); // Alert styling for errors
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
          isInvalid={!email && submitted} // Show invalid feedback if email is not provided and form is submitted
        />
        {!email && submitted && <Form.Control.Feedback type="invalid">Email is required.</Form.Control.Feedback>}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={e => setAmount(e.currentTarget.value)}
          isInvalid={!amount && submitted} // Show invalid feedback if amount is not provided and form is submitted
        />
        {!amount && submitted && <Form.Control.Feedback type="invalid">Amount is required.</Form.Control.Feedback>}
        {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
      </Form.Group>
      <Button variant="primary" onClick={handle}>Deposit</Button>
    </Form>
  );
}

export default Deposit;
