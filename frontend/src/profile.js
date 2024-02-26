import React, { useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState({
    email: '',
    accountNumber: '',
    accountType: '',
    balance: '',
    name: 'type your name',
    phoneNumber: 'type your phone number'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      console.log('Fetching user data...');
      try {
        const response = await fetch(`account/profile?email=${user.email}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json(); // Parse response as JSON
        console.log('User data fetched successfully:', data);
        setUserData({
          email: user.email,
          accountNumber: data.accountNumber,
          accountType: capitalizeFirstLetter(data.accountType),
          balance: formatBalance(data.balance),
          name: data.name || 'type your name',
          phoneNumber: data.phoneNumber || 'type your phone number'
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    if (isAuthenticated && user.email) {
      console.log('User is authenticated. Fetching user data...');
      fetchUserData();
    }
  }, [isAuthenticated, user]);

   // Function to capitalize the first letter of a string
   const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Function to format balance as "$00.00"
  const formatBalance = (balance) => {
    return `$${Number(balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleUpdateProfile = async () => {
    try {
      // Send the updated user data from the state directly
      const response = await fetch('account/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          name: userData.name, // Use userData directly
          phoneNumber: userData.phoneNumber // Use userData directly
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
  
      console.log('Profile updated successfully');
  
      // Optionally, fetch updated user data and set it
      // setUserData(updatedUserData);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  

  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!userData.name) {
      tempErrors.name = 'Name is required';
    }
    if (!userData.phoneNumber.match(/^\d{10}$/)) {
      tempErrors.phoneNumber = 'Phone number must be 10 digits';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  return (
    <>
      <Card className="mt-3 mb-3">
        <Card.Body>
          <Card.Title>User Information</Card.Title>
          <Card.Text>
            <strong>Email:</strong> {userData.email}
          </Card.Text>
          <Card.Text>
            <strong>Account Number:</strong> {userData.accountNumber}
          </Card.Text>
          <Card.Text>
            <strong>Account Type:</strong> {userData.accountType}
          </Card.Text>
          <Card.Text>
            <strong>Balance:</strong> {userData.balance}
          </Card.Text>
        </Card.Body>
      </Card>
      <Card className="mt-3 mb-3">
        <Card.Body>
          <Card.Title>Update Profile</Card.Title>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleChange}
                isInvalid={!!errors.phoneNumber}
              />
              <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" onClick={() => {
              if (validateForm()) {
                handleUpdateProfile();
              }
            }}>
              Update Profile
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default UserProfile;
