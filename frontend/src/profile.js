// Profile.js

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user } = useAuth0();

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Account Number: {user.accountNumber}</p>
      {/* Display other user information here */}
    </div>
  );
};

export default Profile;