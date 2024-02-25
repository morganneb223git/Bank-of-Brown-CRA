/// Login Component ./frontend/src/login.js
import React from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

function Login() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState('');
  const [variant, setVariant] = React.useState('success'); // For Alert styling

  return (
    <Card className="mt-3 mb-3">
      <Card.Body>
        <Card.Title>Login</Card.Title>
        {status && <Alert variant={variant}>{status}</Alert>}
        {show ? (
          <LoginForm setShow={setShow} setStatus={setStatus} setVariant={setVariant} />
        ) : (
          <LoginMsg setShow={setShow} setStatus={setStatus} />
        )}
      </Card.Body>
    </Card>
  );
}

function LoginMsg(props) {
  return (
    <>
      <h5>Success</h5>
      <Button variant="primary" onClick={() => props.setShow(true)}>
        Authenticate again
      </Button>
    </>
  );
}

function LoginForm(props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handle() {
    console.log('Sending login request...');
    fetch('/account/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(response => {
        console.log('Received response headers:', response.headers);
        if (response.status === 401) {
          console.log('Unauthorized: Login failed');
          props.setVariant('danger');
          throw new Error('Unauthorized: Login failed');
        }
        return response.json();
      })
      .then(data => {
        console.log('Received response from server:', data);
        if (data.token) {
          localStorage.setItem('Authorization', `Bearer ${data.token}`);
          props.setStatus('Login successful');
          props.setShow(false);
        } else {
          console.log('No token received in response');
          props.setVariant('warning');
          props.setStatus('No token received, please try again.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        props.setStatus('Failed to login, please try again.');
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
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.currentTarget.value)}
        />
      </Form.Group>

      <Button variant="primary" onClick={handle}>
        Login
      </Button>
    </Form>
  );
}

export default Login;