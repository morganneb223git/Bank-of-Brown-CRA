import React from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

/**
 * The Withdraw component provides users with a form to withdraw funds from their account.
 * It consists of two main parts:
 * - WithdrawForm: The form where users enter their email and the amount to withdraw.
 * - WithdrawMsg: A success message displayed after a successful withdrawal.
 */
function Withdraw() {
  const [show, setShow] = React.useState(true); // Controls whether to show the form or the success message
  const [status, setStatus] = React.useState(''); // Stores status messages to display to the user
  const [variant, setVariant] = React.useState('success'); // Determines the styling of the status alert

  return (
    <Card className="mt-3 mb-3">
      <Card.Header as="h5">Withdraw</Card.Header>
      <Card.Body>
        {/* Conditional rendering of alert messages based on the status and variant */}
        {status && <Alert variant={variant}>{status}</Alert>}
        {show ? 
          <WithdrawForm setShow={setShow} setStatus={setStatus} setVariant={setVariant}/> :
          <WithdrawMsg setShow={setShow} setStatus={setStatus}/>
        }
      </Card.Body>
    </Card>
  );
}

/**
 * WithdrawMsg displays a success message after a withdrawal has been successfully processed.
 * It allows the user to reset the form to make another withdrawal.
 */
function WithdrawMsg({ setShow, setStatus }) {
  return (
    <>
      <h5>Success</h5>
      <Button variant="primary" onClick={() => {
          setShow(true); // Reset to show the form again
          setStatus(''); // Clear any status messages
      }}>
        Withdraw again
      </Button>
    </>
  );
}

/**
 * WithdrawForm provides a form for users to submit a withdrawal request.
 * It includes input fields for the user's email and the amount they wish to withdraw.
 */
function WithdrawForm({ setShow, setStatus, setVariant }) {
  const [email, setEmail] = React.useState(''); // Email input state
  const [amount, setAmount] = React.useState(''); // Amount input state
  const [amountError, setAmountError] = React.useState(''); // Error message state for amount validation

  /**
   * Handles the form submission. Validates the input and makes an API call to process the withdrawal.
   */
  function handle() {
    setAmountError(''); // Clear any existing errors

    // Validate that an email has been entered
    if (!email) {
      setAmountError('Email is required.');
      return;
    }

    // Validate that an amount has been entered and is a valid dollar amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError('Amount must be a valid dollar amount.');
      return;
    }

    // Additional validation and processing logic goes here
    // Example: setStatus call to simulate a successful withdrawal
    setStatus(`Withdrawal successful. Your updated balance will be reflected shortly.`);
    setShow(false); // Hide the form to show the success message
    setVariant('success'); // Set the alert styling to success
  }

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
          isInvalid={!!amountError} // Show invalid feedback if there's an error
        />
        <Form.Control.Feedback type="invalid">{amountError}</Form.Control.Feedback>
      </Form.Group>
      <Button variant="primary" onClick={handle}>Withdraw</Button>
    </Form>
  );
}

export default Withdraw;
