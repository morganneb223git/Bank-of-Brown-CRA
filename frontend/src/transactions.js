/* MIGHT BUILD LATER

// transactions.js
// .frontend/src/transactions.js
import React, { useState, useEffect } from 'react';

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('deposit'); // Assuming 'deposit' as default, adjust as needed
  

  useEffect(() => {
    // Fetch transactions
    fetch('/transactions', {
      method: 'GET',
      headers: {
        // Assuming you store the token in localStorage after login
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(response => response.json())
    
    .then(data => {
        console.log(data);
        setTransactions(data);
    })
    .catch(error => {
        console.error('Error:', error);
        setTransactions([]); // Ensure transactions is always an array
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Post a new transaction
    fetch('/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ amount, description , type }), // Include type in the request
    })
    
    .then(response => response.json())
    .then(data => {
      setTransactions([...transactions, data]);
      setAmount('');
      setDescription('');
    })
    .catch(error => {
        console.error('Error:', error);
        setTransactions([]); // Ensure transactions is always an array
      });
  };

  return (
    <div>
      <h2>Transactions</h2>
      <form onSubmit={handleSubmit}>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        {/* Add a selector or input for transaction type if necessary *//*}
        <button type="submit">Add Transaction</button>
      </form>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>{transaction.description}: ${transaction.amount}</li>
        ))}
      </ul>
    </div>
  );
}

export default Transactions; 
*/