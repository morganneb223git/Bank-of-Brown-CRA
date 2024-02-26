import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

const Profile = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: '',
  });

  // State for dynamic user data
  const [userData, setUserData] = useState({
    accountNumber: '',
    accountType: '',
    balance: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await getAccessTokenSilently();
      fetch(`/account/data?email=${encodeURIComponent(user.email)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched user data:", data); // Add this line to debug
        setUserData({
          accountNumber: data.accountNumber,
          accountType: data.accountType,
          balance: data.balance,
        });
      })
      .catch((error) => console.error('Error fetching user data:', error));
    };

    fetchUserData();
  }, [user.email, getAccessTokenSilently]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = await getAccessTokenSilently();

    fetch('/account/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert('Profile updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile.');
      });
  };

  return (
    <Container>
      <Row className="justify-content-md-center my-4">
        <Col xs={12} md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Account Details</Card.Title>
              <Card.Text>
                Account Number: {userData.accountNumber}
                <br />
                Account Type: {userData.accountType}
                <br />
                Balance: {userData.balance}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2>Edit Profile</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formGroupName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="formGroupEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="formGroupPassword">
              <Form.Label>Password (leave blank to keep the same)</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
            </Form.Group>

            <Button variant="primary" type="submit">
              Update Profile
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
