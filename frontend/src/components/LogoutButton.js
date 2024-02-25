// LogoutButton.js

import React from 'react';

function LogoutButton({ onLogout }) {
  return (
    <button onClick={onLogout}>Logout</button>
  );
}

export default LogoutButton;