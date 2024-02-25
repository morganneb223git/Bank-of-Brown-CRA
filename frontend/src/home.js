import React from 'react';
import { Card } from 'react-bootstrap';
// Import the image
import bankImage from './assets/bank.png';

function Home() {
  return (
    <Card className="text-center">
      <Card.Header as="h5">Bank of Brown Landing Module</Card.Header>
      <Card.Body>
        <Card.Title>Welcome to the bank</Card.Title>
        <Card.Text>
          You can move around using the navigation bar.
        </Card.Text>
        {/* Use the imported image as a src */}
        <img src={bankImage} className="img-fluid" alt="Bad Bank Logo" />
        {/* Render the LoginButton component */}
        <div className="mt-3">
        </div>
      </Card.Body>
    </Card>
  );
}

export default Home;