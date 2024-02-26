import React from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

function CreateAccount() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState('');
  const [variant, setVariant] = React.useState('success'); // For Alert styling

  return (
    <Card className="mt-3 mb-3">
      <Card.Body>
        <Card.Title>Create Bank Account</Card.Title>
        {status && <Alert variant={variant}>{status}</Alert>}
        {show ? 
          <CreateForm setShow={setShow} setStatus={setStatus} setVariant={setVariant} /> : 
          <CreateMsg setShow={setShow} />}
      </Card.Body>
    </Card>
  );
}

function CreateMsg(props) {
  return (
    <>
      <h5>Success</h5>
      <Button variant="primary" onClick={() => props.setShow(true)}>Add another account</Button>
    </>
  );
}

function CreateForm(props) {
  const [email, setEmail] = React.useState('');
  const [accountType, setAccountType] = React.useState('checking');
  const [errors, setErrors] = React.useState({});

  const handleCreateAccount = async () => {
    console.log('Form submitted with email:', email, 'and account type:', accountType);
  
    if (!validateForm()) return;
  
    try {
      const response = await fetch('/account/createbank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, accountType }),
      });
  
      console.log('Response received:', response);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Data received:', data);
  
      if (data.user && data.user.accountNumber) {
        props.setShow(false);
        props.setStatus(`Account successfully created. Here is your new Account Number: ${data.user.accountNumber}.`);
        props.setVariant('success');
      } else {
        throw new Error('Failed to retrieve account information or account number is missing');
      }
    } catch (error) {
      console.error('Error:', error);
      props.setStatus('Failed to create account. Please try again.');
      props.setVariant('danger');
    }
  };
  
  const validateForm = () => {
    let tempErrors = {};
    if (!email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Email is invalid";
    } else if (!/\S+@\S+\.(com|org|edu)$/.test(email)) {
      tempErrors.email = "Email must end with .com, .org, or .edu";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control 
          type="email" 
          placeholder="Enter email" 
          value={email} 
          isInvalid={!!errors.email} 
          onChange={e => setEmail(e.currentTarget.value)} />
        <Form.Control.Feedback type="invalid">
          {errors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <h6>Account Type</h6>

      <Form.Group className="mb-3">
        <Form.Select value={accountType} onChange={e => setAccountType(e.currentTarget.value)}>
          <option value="Checking">Checking</option>
          <option value="Savings">Savings</option>
        </Form.Select>
      </Form.Group>

      <Button variant="primary" onClick={handleCreateAccount}>Create Bank Account</Button>
    </Form>
  );
}

export default CreateAccount;
